import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { db, verifyPassword } from './server/db.js';
import { authenticate, requireRole, createSessionToken, revokeSession, AuthenticatedRequest } from './server/auth.js';
import { marketDataService } from './server/marketData.js';
import { generateAIAnalysis } from './server/ai.js';
import { Timeframe } from './src/types.js';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // ----------------------------------------------------
  // PUBLIC HEALTH & SYSTEM STATUS
  // ----------------------------------------------------
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'NEWAZ CAPITALX Trading Engine',
      timestamp: new Date().toISOString(),
    });
  });

  app.get('/api/market-status', (req, res) => {
    res.json(marketDataService.getStatus());
  });

  // ----------------------------------------------------
  // AUTHENTICATION ROUTES
  // ----------------------------------------------------
  app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required.' });
    }

    const user = db.findUserByUsername(username);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    if (user.status === 'disabled') {
      return res.status(403).json({ error: 'Account is disabled. Contact system administrator.' });
    }

    const isValid = verifyPassword(password, user.passwordHash, user.salt);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const token = createSessionToken(user.id, user.role, user.username);
    db.addAuditLog(user.username, 'LOGIN', `User logged in successfully with role ${user.role}`);

    const { passwordHash, salt, ...safeUser } = user;
    res.json({
      token,
      user: safeUser,
    });
  });

  app.get('/api/auth/me', authenticate, (req: AuthenticatedRequest, res) => {
    const user = db.findUserById(req.user!.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const { passwordHash, salt, ...safeUser } = user;
    res.json({ user: safeUser });
  });

  app.post('/api/auth/logout', authenticate, (req: AuthenticatedRequest, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) revokeSession(token);
    res.json({ success: true });
  });

  app.post('/api/auth/change-password', authenticate, (req: AuthenticatedRequest, res) => {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current and new password are required.' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters long.' });
    }

    const user = db.findUserById(req.user!.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (!verifyPassword(currentPassword, user.passwordHash, user.salt)) {
      return res.status(400).json({ error: 'Current password is incorrect.' });
    }

    db.updateUserPassword(user.id, newPassword, user.username);
    res.json({ success: true, message: 'Password updated successfully.' });
  });

  // ----------------------------------------------------
  // PUBLIC / PROTECTED MARKET & SIGNAL APIS
  // ----------------------------------------------------
  app.get('/api/markets', (req, res) => {
    res.json(db.getMarkets());
  });

  app.get('/api/candles', (req, res) => {
    const symbol = (req.query.symbol as string) || 'EUR/USD';
    const timeframe = (req.query.timeframe as Timeframe) || '1M';
    const candles = marketDataService.getCandles(symbol, timeframe);
    res.json({ symbol, timeframe, candles });
  });

  app.get('/api/signals', (req, res) => {
    const signals = marketDataService.getAllSignals();
    res.json(signals);
  });

  app.get('/api/signals/:symbol', (req, res) => {
    const symbol = req.params.symbol;
    const timeframe = (req.query.timeframe as Timeframe) || '1M';
    const signal = marketDataService.getSignal(symbol, timeframe);
    if (!signal) {
      return res.status(404).json({ error: 'Signal not available or market data offline' });
    }
    res.json(signal);
  });

  // ----------------------------------------------------
  // AI ANALYSIS API (Gemini 3.8 Flash + Quantitative Engine)
  // ----------------------------------------------------
  app.get('/api/ai/analyze', async (req, res) => {
    const symbol = (req.query.symbol as string) || 'EUR/USD';
    const timeframe = (req.query.timeframe as string) || '1M';
    try {
      const analysis = await generateAIAnalysis(symbol, timeframe);
      res.json(analysis);
    } catch (err: any) {
      res.status(500).json({ error: 'AI Analysis computation failed: ' + err.message });
    }
  });

  // ----------------------------------------------------
  // TRADE JOURNAL & ALERTS
  // ----------------------------------------------------
  app.get('/api/trades', (req, res) => {
    res.json(db.getTrades());
  });

  app.post('/api/trades', (req, res) => {
    const trade = req.body;
    if (!trade.asset || !trade.direction || !trade.stake) {
      return res.status(400).json({ error: 'Asset, direction, and stake are required.' });
    }
    const created = db.addTrade(trade);
    res.json(created);
  });

  app.delete('/api/trades/:id', authenticate, (req, res) => {
    const ok = db.deleteTrade(req.params.id);
    res.json({ success: ok });
  });

  app.get('/api/alerts', (req, res) => {
    res.json(db.getAlerts());
  });

  app.post('/api/alerts/mark-read/:id', (req, res) => {
    db.markAlertRead(req.params.id);
    res.json({ success: true });
  });

  app.delete('/api/alerts', (req, res) => {
    db.clearAllAlerts();
    res.json({ success: true });
  });

  // ----------------------------------------------------
  // SETTINGS & ADMIN CMS
  // ----------------------------------------------------
  app.get('/api/settings', (req, res) => {
    res.json(db.getSettings());
  });

  app.put('/api/settings', authenticate, requireRole('admin'), (req: AuthenticatedRequest, res) => {
    const updated = db.updateSettings(req.body, req.user!.username);
    res.json(updated);
  });

  // Markets management
  app.post('/api/markets', authenticate, requireRole('admin'), (req: AuthenticatedRequest, res) => {
    const market = db.addMarket(req.body, req.user!.username);
    res.json(market);
  });

  app.put('/api/markets/:symbol', authenticate, requireRole('admin'), (req: AuthenticatedRequest, res) => {
    const updated = db.updateMarket(decodeURIComponent(req.params.symbol), req.body);
    if (!updated) return res.status(404).json({ error: 'Market asset not found' });
    res.json(updated);
  });

  app.delete('/api/markets/:symbol', authenticate, requireRole('admin'), (req: AuthenticatedRequest, res) => {
    const ok = db.removeMarket(decodeURIComponent(req.params.symbol), req.user!.username);
    res.json({ success: ok });
  });

  // User accounts management (Admin only)
  app.get('/api/users', authenticate, requireRole('admin'), (req, res) => {
    res.json(db.getUsers());
  });

  app.post('/api/users', authenticate, requireRole('admin'), (req: AuthenticatedRequest, res) => {
    const { username, name, email, role, password } = req.body;
    if (!username || !password || !role) {
      return res.status(400).json({ error: 'Username, password, and role are required' });
    }
    const created = db.addUser({ username, name: name || username, email: email || '', role, password }, req.user!.username);
    res.json(created);
  });

  app.put('/api/users/:id/status', authenticate, requireRole('admin'), (req: AuthenticatedRequest, res) => {
    const ok = db.updateUserStatus(req.params.id, req.body.status, req.user!.username);
    res.json({ success: ok });
  });

  app.delete('/api/users/:id', authenticate, requireRole('admin'), (req: AuthenticatedRequest, res) => {
    const ok = db.deleteUser(req.params.id, req.user!.username);
    if (!ok) return res.status(400).json({ error: 'Cannot delete root admin or user not found' });
    res.json({ success: true });
  });

  // ----------------------------------------------------
  // VITE MIDDLEWARE (Dev) or STATIC SERVING (Prod)
  // ----------------------------------------------------
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[NEWAZ CAPITALX] Terminal server running on port ${PORT}`);
  });
}

startServer().catch(err => {
  console.error('[NEWAZ CAPITALX] Startup error:', err);
});
