import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { storage } from "./storage";
import type { User } from "@shared/schema";
import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return done(null, false, { message: "Invalid username or password" });
      }

      const isValid = await comparePassword(password, user.password);
      if (!isValid) {
        return done(null, false, { message: "Invalid username or password" });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);

passport.serializeUser((user: Express.User, done) => {
  done(null, (user as User).id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await storage.getUser(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

declare global {
  namespace Express {
    interface User {
      id: string;
      username: string;
      email: string;
      role: 'USER' | 'ADMIN';
      coins: number;
      avatar: string | null;
      createdAt: Date;
    }
  }
}

export function requireAuth(req: any, res: any, next: any) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
}

export function requireAdmin(req: any, res: any, next: any) {
  if (req.isAuthenticated() && req.user.role === 'ADMIN') {
    return next();
  }
  res.status(403).json({ message: "Forbidden - Admin access required" });
}
