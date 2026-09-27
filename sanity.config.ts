import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { apiVersion, dataset, projectId } from "./sanity/env";
import { schema } from "./sanity/schemaTypes";
import { SINGLETON_TYPES, structure } from "./sanity/structure";

// Singletons can only be edited and published, never created, duplicated or deleted.
const SINGLETON_ACTIONS = new Set(["publish", "discardChanges", "restore"]);

export default defineConfig({
  basePath: "/studio",
  name: "rempang_eco_city",
  title: "Rempang Eco City CMS",
  projectId,
  dataset,
  schema: {
    ...schema,
    // Hide singletons from the global "Create new document" menu.
    templates: (templates) =>
      templates.filter(({ schemaType }) => !SINGLETON_TYPES.has(schemaType)),
  },
  document: {
    actions: (actions, { schemaType }) =>
      SINGLETON_TYPES.has(schemaType)
        ? actions.filter(({ action }) => action && SINGLETON_ACTIONS.has(action))
        : actions,
  },
  plugins: [
    structureTool({ structure }),
    // Vision lets you run GROQ queries inside the Studio for debugging.
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
