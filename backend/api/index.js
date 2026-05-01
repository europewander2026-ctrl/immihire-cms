const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { z } = require('zod');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { put } = require('@vercel/blob');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');
const axios = require('axios'); // We might need axios for brevo, but we can just use fetch.

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
const app = express();
app.set('trust proxy', 1); // Fix for Vercel edge network rate limiting

// Security Middleware
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

const corsOptions = {
  origin: 'https://demo.hmhlabz.com',
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

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

const resetPasswordSchema = z.object({
  token: z.string(),
  newPassword: z.string().min(6),
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

const requireSuperadmin = (req, res, next) => {
  requireAuth(req, res, () => {
    if (req.user.role !== 'SUPERADMIN') {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  });
};

// --- Routes ---

// 1. POST /api/login
app.post('/api/login', async (req, res) => {
  try {
    const data = loginSchema.parse(req.body);
    console.log("Login attempt for:", data.email);
    
    const user = await prisma.adminUser.findUnique({ where: { email: data.email } });
    
    if (!user) {
      console.log("Login failed: User not found in DB.");
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) {
      console.log("Login failed: Password hash did not match.");
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    if (!user.isActive) {
      console.log("Login failed: Account is disabled.");
      return res.status(403).json({ error: 'Account disabled' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    
    console.log("Login success! Generating cross-domain cookie.");
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: true, // MUST be true for SameSite=None
      sameSite: 'none', // Mandatory for cross-domain cookies
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    res.json({ message: 'Logged in successfully' });
  } catch (error) {
    console.error("Login route error:", error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 1.1 GET /api/me
app.get('/api/me', requireAuth, async (req, res) => {
  try {
    const user = await prisma.adminUser.findUnique({ where: { id: req.user.id } });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ id: user.id, email: user.email, role: user.role, isActive: user.isActive });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 1.2 POST /api/forgot-password
app.post('/api/forgot-password', async (req, res) => {
  try {
    const { email } = forgotPasswordSchema.parse(req.body);
    const user = await prisma.adminUser.findUnique({ where: { email } });
    
    if (user && process.env.BREVO_API_KEY) {
      const resetToken = require('crypto').randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 3600000); // 1 hour
      
      await prisma.passwordResetToken.create({
        data: { token: resetToken, userId: user.id, expiresAt }
      });

      const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5174'}/reset-password?token=${resetToken}`;
      
      await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'api-key': process.env.BREVO_API_KEY,
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          sender: { name: "Admin System", email: "no-reply@yourdomain.com" },
          to: [{ email, name: "Admin" }],
          subject: "Password Reset Request",
          htmlContent: `<p>Click here to reset your password: <a href="${resetUrl}">${resetUrl}</a></p>`
        })
      });
    }

    res.json({ message: 'If that email exists, a reset link has been sent.' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 1.3 POST /api/reset-password
app.post('/api/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = resetPasswordSchema.parse(req.body);
    const resetRecord = await prisma.passwordResetToken.findUnique({ where: { token } });
    
    if (!resetRecord || resetRecord.expiresAt < new Date()) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.adminUser.update({
      where: { id: resetRecord.userId },
      data: { password: hashedPassword }
    });

    await prisma.passwordResetToken.delete({ where: { token } });

    res.json({ message: 'Password reset successful' });
  } catch (error) {
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

// 4.1 POST /api/blogs
app.post('/api/blogs', requireAuth, async (req, res) => {
  try {
    const blog = await prisma.blog.create({
      data: req.body
    });
    res.status(201).json(blog);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create blog' });
  }
});

// 4.2 Admin Management Routes (SUPERADMIN only)
app.get('/api/admins', requireSuperadmin, async (req, res) => {
  try {
    const admins = await prisma.adminUser.findMany({
      select: { id: true, email: true, role: true, isActive: true, createdAt: true }
    });
    res.json(admins);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch admins' });
  }
});

app.post('/api/admins', requireSuperadmin, async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await prisma.adminUser.create({
      data: { email, password: hashedPassword, role: 'ADMIN' },
      select: { id: true, email: true, role: true, isActive: true }
    });
    res.status(201).json(admin);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create admin. Email might exist.' });
  }
});

app.patch('/api/admins/:id/status', requireSuperadmin, async (req, res) => {
  try {
    if (req.params.id === req.user.id) {
      return res.status(400).json({ error: 'Cannot change your own status' });
    }
    const { isActive } = req.body;
    const admin = await prisma.adminUser.update({
      where: { id: req.params.id },
      data: { isActive },
      select: { id: true, email: true, role: true, isActive: true }
    });
    res.json(admin);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update status' });
  }
});

app.delete('/api/admins/:id', requireSuperadmin, async (req, res) => {
  try {
    if (req.params.id === req.user.id) {
      return res.status(400).json({ error: 'Cannot delete yourself' });
    }
    await prisma.adminUser.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete admin' });
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

// 8. GET /api/settings/global
app.get('/api/settings/global', async (req, res) => {
  try {
    const settings = await prisma.globalSettings.findUnique({
      where: { id: "1" }
    });
    res.json(settings || { id: "1", siteName: "ImmiHire", contactAddress: "", contactEmail: "", contactPhone: "", copyrightText: "", headerNav: [], footerNav: [] });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 9. PUT /api/settings/global (Protected Route)
app.put('/api/settings/global', requireAuth, async (req, res) => {
  try {
    const { siteName, contactAddress, contactEmail, contactPhone, copyrightText, headerNav, footerNav } = req.body;
    
    const settings = await prisma.globalSettings.upsert({
      where: { id: "1" },
      update: { siteName, contactAddress, contactEmail, contactPhone, copyrightText, headerNav, footerNav },
      create: { id: "1", siteName, contactAddress, contactEmail, contactPhone, copyrightText, headerNav, footerNav }
    });

    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 10. GET /api/pages
app.get('/api/pages', async (req, res) => {
  try {
    const pages = await prisma.page.findMany({
      orderBy: { updatedAt: 'desc' }
    });
    res.json(pages);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 11. GET /api/pages/:slug
app.get('/api/pages/:slug', async (req, res) => {
  try {
    const page = await prisma.page.findUnique({
      where: { slug: req.params.slug }
    });
    if (!page) {
      return res.status(404).json({ error: 'Page not found' });
    }
    res.json(page);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 12. PUT /api/pages/:slug (Protected Route)
app.put('/api/pages/:slug', requireAuth, async (req, res) => {
  try {
    const { title, content, seoTitle, seoDescription, focusKeywords, googleSchema } = req.body;
    const slug = req.params.slug;

    const page = await prisma.page.upsert({
      where: { slug },
      update: { title, content, seoTitle, seoDescription, focusKeywords, googleSchema },
      create: { slug, title, content, seoTitle, seoDescription, focusKeywords, googleSchema }
    });

    res.json(page);
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
