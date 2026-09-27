import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

// iOS fills transparent pixels with black, so the round logo is placed on a
// white square instead of reusing the transparent app/icon.png.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  const logo = await readFile(
    path.join(process.cwd(), "public/images/logo-kementrans.png")
  );
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#ffffff",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} width={156} height={156} alt="" />
      </div>
    ),
    size
  );
}
