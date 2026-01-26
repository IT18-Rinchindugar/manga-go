import { createServer } from "vite";

async function startServer() {
  const vite = await createServer({
    server: {
      host: "0.0.0.0",
      port: 5000,
    },
    configFile: "./vite.config.ts",
  });

  await vite.listen();
  console.log("Vite dev server running on http://0.0.0.0:5000");
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
