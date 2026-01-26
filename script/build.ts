import { build } from "vite";

async function buildApp() {
  console.log("Building for production...");
  
  await build({
    configFile: "./vite.config.ts",
  });
  
  console.log("Build complete! Output in dist/public");
}

buildApp().catch((err) => {
  console.error("Build failed:", err);
  process.exit(1);
});
