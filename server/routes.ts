import type { Express } from "express";
import { createServer, type Server } from "http";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Frontend-only prototype - all API calls are handled by mock data in the client
  // No backend routes needed
  return httpServer;
}
