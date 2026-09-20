import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { apiVersion, dataset, projectId } from "./sanity/env";
import { schema } from "./sanity/schemaTypes";

export default defineConfig({
  basePath: "/studio",
  name: "rempang_eco_city",
  title: "Rempang Eco City CMS",
  projectId,
  dataset,
  schema,
  plugins: [
    structureTool(),
    // Vision lets you run GROQ queries inside the Studio for debugging.
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
