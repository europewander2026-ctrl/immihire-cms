const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { z } = require('zod');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { put } = require('@vercel/blob');
const { PrismaClient } = require('@prisma/client');
const axios = require('axios'); // We might need axios for brevo, but we can just use fetch.

const prisma = new PrismaClient();
const app = express();

// Security Middleware
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Rate Limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/login', apiLimiter);
app.use('/api/consultation', apiLimiter);
app.use('/api/subscribe', apiLimiter);

// Zod Schemas
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const consultationSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().min(10),
});

const subscribeSchema = z.object({
  email: z.string().email(),
});

// Middleware for Protected Routes
const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// --- Routes ---

// 1. POST /api/login
app.post('/api/login', async (req, res) => {
  try {
    const data = loginSchema.parse(req.body);
    const user = await prisma.adminUser.findUnique({ where: { email: data.email } });
    
    if (!user || !(await bcrypt.compare(data.password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    res.json({ message: 'Logged in successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 2. POST /api/consultation
app.post('/api/consultation', async (req, res) => {
  try {
    const data = consultationSchema.parse(req.body);
    
    // Save to database
    const consultation = await prisma.consultation.create({
      data
    });

    // Trigger Brevo Email
    if (process.env.BREVO_API_KEY) {
      await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'api-key': process.env.BREVO_API_KEY,
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          sender: { name: "Website Consultations", email: "no-reply@yourdomain.com" },
          to: [{ email: process.env.ADMIN_EMAIL || data.email, name: "Admin" }],
          subject: "New Consultation Request",
          htmlContent: `<p>New consultation from ${data.name} (${data.email}):</p><p>${data.message}</p>`
        })
      });
    }

    res.status(201).json(consultation);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 3. POST /api/subscribe
app.post('/api/subscribe', async (req, res) => {
  try {
    const data = subscribeSchema.parse(req.body);
    
    // Save to DB
    const subscriber = await prisma.subscriber.create({
      data
    });

    // Add to Brevo list
    if (process.env.BREVO_API_KEY && process.env.BREVO_LIST_ID) {
      await fetch('https://api.brevo.com/v3/contacts', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'api-key': process.env.BREVO_API_KEY,
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          email: data.email,
          listIds: [parseInt(process.env.BREVO_LIST_ID)],
          updateEnabled: true
        })
      });
    }

    res.status(201).json(subscriber);
  } catch (error) {
    if (error.code === 'P2002') { // Prisma unique constraint violation
      return res.status(400).json({ error: 'Already subscribed' });
    }
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 4. GET /api/blogs
app.get('/api/blogs', async (req, res) => {
  try {
    const blogs = await prisma.blog.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 5. POST /api/upload (Protected Route)
app.post('/api/upload', requireAuth, async (req, res) => {
  try {
    const filename = req.headers['x-vercel-filename'] || 'file';
    
    // Using put from @vercel/blob
    const blob = await put(filename, req, {
      access: 'public',
    });

    res.json({ url: blob.url });
  } catch (error) {
    res.status(500).json({ error: 'Upload failed', details: error.message });
  }
});

// 6. GET /api/settings
app.get('/api/settings', async (req, res) => {
  try {
    const settings = await prisma.siteSettings.findUnique({
      where: { id: 1 }
    });
    res.json(settings || { id: 1, logoUrl: null, faviconUrl: null });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 7. POST /api/settings (Protected Route)
app.post('/api/settings', requireAuth, async (req, res) => {
  try {
    const { logoUrl, faviconUrl } = req.body;
    
    const settings = await prisma.siteSettings.upsert({
      where: { id: 1 },
      update: { logoUrl, faviconUrl },
      create: { id: 1, logoUrl, faviconUrl }
    });

    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Export the app for Vercel
module.exports = app;

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => console.log(`Server running locally on port ${PORT}`));
}
