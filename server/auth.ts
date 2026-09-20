import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { db, verifyPassword } from './db.js';
import { UserRole } from '../src/types.js';

// In-memory active session tokens map: token -> { userId, expiresAt }
interface SessionData {
  userId: string;
  role: UserRole;
  username: string;
  expiresAt: number;
}

const activeSessions = new Map<string, SessionData>();

// Session TTL: 24 hours
const SESSION_TTL_MS = 24 * 60 * 60 * 1000;

export function createSessionToken(userId: string, role: UserRole, username: string): string {
  const token = 'nxt_' + crypto.randomBytes(32).toString('hex');
  const expiresAt = Date.now() + SESSION_TTL_MS;
  activeSessions.set(token, { userId, role, username, expiresAt });
  return token;
}

export function revokeSession(token: string): void {
  activeSessions.delete(token);
}

export function getSession(token?: string): SessionData | null {
  if (!token) return null;
  const session = activeSessions.get(token);
  if (!session) return null;
  if (Date.now() > session.expiresAt) {
    activeSessions.delete(token);
    return null;
  }
  return session;
}

// Express auth middleware
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    username: string;
    role: UserRole;
  };
}

export function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required. Please log in.' });
  }

  const token = authHeader.split(' ')[1];
  const session = getSession(token);
  if (!session) {
    return res.status(401).json({ error: 'Session expired or invalid token.' });
  }

  req.user = {
    id: session.userId,
    username: session.username,
    role: session.role,
  };
  next();
}

export function requireRole(...roles: UserRole[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required.' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied: Insufficient permissions.' });
    }
    next();
  };
}
