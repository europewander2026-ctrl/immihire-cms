const express = require('express');
const cookieParser = require('cookie-parser');
const prisma = require('../utils/db');
const jwt = require('jsonwebtoken');

// Import Controllers
const loginController = require('../backend/controllers/login');
const meController = require('../backend/controllers/me');
const contactController = require('../backend/controllers/contact');
const contentController = require('../backend/controllers/content');
const leadsController = require('../backend/controllers/leads');
const uploadController = require('../backend/controllers/upload');

// Import Legacy Sub-modules (that mount multiple routes)
const insightsInit = require('../backend/controllers/insights');
const servicesInit = require('../backend/controllers/services');
const profileInit = require('../backend/controllers/profile');
const settingsInit = require('../backend/controllers/settings');
const consultationsInit = require('../backend/controllers/consultations');
const seoInit = require('../backend/controllers/seo');

const app = express();

// Middleware
app.use(express.json());

// Handle CORS preflight globally without relying on path-to-regexp wildcards
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

app.use(cookieParser());

// Auth Middleware for sub-modules
const requireAuth = (req, res, next) => {
  const token = req.cookies?.jwt || req.headers.cookie?.split('jwt=')[1]?.split(';')[0];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Route Mapping - Standalone Handlers
app.all('/api/login', loginController);
app.all('/api/me', meController);
app.all('/api/contact', contactController);
app.all('/api/admin/content', contentController);
app.all('/api/admin/leads', leadsController);
app.all('/api/admin/upload', uploadController);

// Route Mapping - Sub-modules (Legacy pattern)
// These mount their own internal routes like app.get('/api/insights', ...)
insightsInit(app, prisma, requireAuth);
servicesInit(app, prisma, requireAuth);
profileInit(app, prisma, requireAuth);
settingsInit(app, prisma, requireAuth);
consultationsInit(app, prisma, requireAuth);

// SEO is a router
app.use('/api/seo', requireAuth, seoInit);

// Public Page Routes
app.get('/api/pages', async (req, res) => {
  try {
    const pages = await prisma.page.findMany({ orderBy: { updatedAt: 'desc' } });
    res.json(pages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch pages' });
  }
});

app.get('/api/pages/:slug', async (req, res) => {
  try {
    const page = await prisma.page.findUnique({ where: { slug: req.params.slug } });
    if (!page) return res.status(404).json({ error: 'Page not found' });
    res.json(page);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch page details' });
  }
});

// Default 404 for API
app.use('/api', (req, res) => {
  res.status(404).json({ error: `API route ${req.originalUrl} not found` });
});

module.exports = app;

export const config = {
  api: {
    bodyParser: false,
  },
};
