// Housing blocks of Perumahan Relokasi Pulau Rempang, drawn by hand over the
// OpenStreetMap layer of the site map and converted to coordinates. Blocks
// are added one at a time; expect an error of a metre or two.
//
// `houses` holds [lat, lng, house number].
export type BlokRumah = {
  name: string;
  label: [number, number];
  polygon: [number, number][];
  houses: [number, number, string][];
};

export const BLOK_RUMAH: BlokRumah[] = [
  {
    name: "A3",
    label: [0.814374, 104.221748],
    polygon: [[0.81431,104.221498],[0.81431,104.221963],[0.814018,104.221971],[0.813633,104.22199],[0.81354,104.221971],[0.813461,104.22195],[0.813381,104.221923],[0.813328,104.221875],[0.813261,104.221804],[0.813182,104.221684],[0.813057,104.221525],[0.813487,104.221273],[0.81358,104.221419],[0.813633,104.221477],[0.8137,104.221501]],
    houses: [[0.813445,104.221424,"1"],[0.813556,104.221594,"2"],[0.813763,104.22162,"3"],[0.813992,104.221597,"4"],[0.814196,104.221597,"5"],[0.814196,104.221886,"6"],[0.813997,104.221886,"7"],[0.813787,104.221886,"8"],[0.813583,104.221889,"9"],[0.813423,104.22182,"10"],[0.813296,104.221721,"11"],[0.813219,104.221557,"12"]],
  },
];
