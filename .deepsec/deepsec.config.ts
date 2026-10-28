import { defineConfig } from "deepsec/config";
import { generatedMatchersPlugin } from "./generated-matchers.js";

export default defineConfig({
  ai: {"mode":"gateway","provider":"vercel"}, // <deepsec:model-route>
  projects: [
    { id: "Personal-Portfolio-Site", root: ".." },
    // <deepsec:projects-insert-above>
  ],
  plugins: [generatedMatchersPlugin],
});
