import L from "leaflet";

// Slope classes, the same breaks as the reference map from the TUM summer
// course team. `max` is the upper bound in percent (rise / run × 100).
// Flatter classes are more transparent so the climbs stand out over the photo.
export const SLOPE_CLASSES = [
  { max: 8, label: "0–8%", name: "Datar", rgb: [34, 197, 94], alpha: 90 },
  { max: 15, label: "8–15%", name: "Landai", rgb: [163, 230, 53], alpha: 170 },
  { max: 25, label: "15–25%", name: "Agak menanjak", rgb: [250, 204, 21], alpha: 255 },
  { max: 40, label: "25–40%", name: "Menanjak", rgb: [249, 115, 22], alpha: 255 },
  { max: Infinity, label: "> 40%", name: "Sangat curam", rgb: [220, 38, 38], alpha: 255 },
] as const;

// Free global elevation tiles (Mapzen "Terrarium" encoding, hosted on AWS Open
// Data). Over Indonesia the source is mostly SRTM (~30 m), so this shows the
// shape of the land, not individual road cuts or recent earthworks.
const TERRAIN_URL = "https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png";
const TERRAIN_MAX_ZOOM = 15;
const TERRAIN_ATTRIBUTION =
  'Elevasi: <a href="https://registry.opendata.aws/terrain-tiles/" target="_blank" rel="noopener">SRTM</a>';

// Measure height differences over ~30 m, the resolution of the source data.
// A shorter distance would only amplify noise from the resampling.
const SAMPLE_DISTANCE_M = 15;

// Everything below this is treated as sea (or flat shore/mangrove) and left
// transparent. SRTM is noisy near the water line, so a little above 0 m.
const SEA_LEVEL_M = 3;

const EARTH_CIRCUMFERENCE_M = 40075016.686;
const TILE_SIZE = 256;

function tileCenterLatitude(y: number, z: number) {
  const n = Math.PI - (2 * Math.PI * (y + 0.5)) / 2 ** z;
  return Math.atan(Math.sinh(n));
}

function classify(slopePercent: number) {
  return SLOPE_CLASSES.find((slopeClass) => slopePercent < slopeClass.max) ?? SLOPE_CLASSES[4];
}

function drawSlope(image: HTMLImageElement, canvas: HTMLCanvasElement, coords: L.Coords) {
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) return;

  context.drawImage(image, 0, 0);
  const pixels = context.getImageData(0, 0, TILE_SIZE, TILE_SIZE);
  const data = pixels.data;

  // Terrarium: elevation = R × 256 + G + B / 256 − 32768 (metres).
  const elevation = new Float32Array(TILE_SIZE * TILE_SIZE);
  for (let i = 0; i < elevation.length; i++) {
    elevation[i] = data[i * 4] * 256 + data[i * 4 + 1] + data[i * 4 + 2] / 256 - 32768;
  }

  const metresPerPixel =
    (EARTH_CIRCUMFERENCE_M * Math.cos(tileCenterLatitude(coords.y, coords.z))) /
    (TILE_SIZE * 2 ** coords.z);
  const step = Math.max(1, Math.round(SAMPLE_DISTANCE_M / metresPerPixel));
  const last = TILE_SIZE - 1;

  for (let y = 0; y < TILE_SIZE; y++) {
    // Near the tile edge the neighbour is clamped, and the divisor uses the
    // real distance so edges are not flatter than the middle.
    const top = Math.max(0, y - step);
    const bottom = Math.min(last, y + step);

    for (let x = 0; x < TILE_SIZE; x++) {
      const index = y * TILE_SIZE + x;
      const out = index * 4;

      const left = Math.max(0, x - step);
      const right = Math.min(last, x + step);
      const westE = elevation[y * TILE_SIZE + left];
      const eastE = elevation[y * TILE_SIZE + right];
      const northE = elevation[top * TILE_SIZE + x];
      const southE = elevation[bottom * TILE_SIZE + x];

      // Sea, and the shoreline strip next to it: the jump from 0 m to land
      // would otherwise show up as a steep red edge along the coast.
      if (Math.min(elevation[index], westE, eastE, northE, southE) < SEA_LEVEL_M) {
        data[out + 3] = 0;
        continue;
      }

      const dzdx = (eastE - westE) / ((right - left) * metresPerPixel);
      const dzdy = (southE - northE) / ((bottom - top) * metresPerPixel);
      const slopePercent = Math.hypot(dzdx, dzdy) * 100;

      const { rgb, alpha } = classify(slopePercent);
      data[out] = rgb[0];
      data[out + 1] = rgb[1];
      data[out + 2] = rgb[2];
      data[out + 3] = alpha;
    }
  }

  context.putImageData(pixels, 0, 0);
}

/** Leaflet layer that colours the land by slope class. */
class SlopeLayer extends L.GridLayer {
  createTile(coords: L.Coords, done: L.DoneCallback) {
    const canvas = document.createElement("canvas");
    canvas.width = TILE_SIZE;
    canvas.height = TILE_SIZE;

    const image = new Image();
    // Needed to read the pixels back from a canvas (the tiles send CORS headers).
    image.crossOrigin = "anonymous";
    image.onload = () => {
      drawSlope(image, canvas, coords);
      done(undefined, canvas);
    };
    image.onerror = () => done(new Error("Gagal memuat data elevasi"), canvas);
    image.src = L.Util.template(TERRAIN_URL, coords);

    return canvas;
  }
}

export function createSlopeLayer(options: L.GridLayerOptions = {}) {
  return new SlopeLayer({
    maxNativeZoom: TERRAIN_MAX_ZOOM,
    attribution: TERRAIN_ATTRIBUTION,
    ...options,
  });
}
