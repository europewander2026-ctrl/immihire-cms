const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

const requireAuth = (req) => {
  const token = req.cookies?.jwt || req.headers.cookie?.split('jwt=')[1]?.split(';')[0];
  if (!token) throw new Error('Unauthorized');
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = async function handler(req, res) {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const user = requireAuth(req);

    if (req.method === 'GET') {
      const pages = await prisma.page.findMany({
        orderBy: { updatedAt: 'desc' }
      });
      return res.status(200).json(pages);
    }

    if (req.method === 'POST' || req.method === 'PUT') {
      const { title, sections, seoTitle, seoDescription, seoKeywords, googleSchema, slug } = req.body;
      const targetSlug = req.method === 'PUT' ? (req.query.slug || slug) : slug;

      const page = await prisma.page.upsert({
        where: { slug: targetSlug },
        update: { title, sections, seoTitle, seoDescription, seoKeywords, googleSchema },
        create: { slug: targetSlug, title, sections, seoTitle, seoDescription, seoKeywords, googleSchema }
      });

      return res.status(200).json(page);
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (error) {
    if (error.message === 'Unauthorized') return res.status(401).json({ error: 'Unauthorized' });
    console.error("Content API error:", error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
