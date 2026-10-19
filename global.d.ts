// Side-effect CSS imports such as `import "leaflet/dist/leaflet.css"` load a
// stylesheet and export nothing. Next.js handles them at build time; this
// declaration stops newer TypeScript versions (in the editor) from flagging
// them with "Cannot find module or type declarations for side-effect import".
declare module "*.css";
