const prisma = require('../../utils/db');
const jwt = require('jsonwebtoken');

const requireAuth = (req) => {
  let token = req.cookies?.jwt || (req.headers.cookie && req.headers.cookie.split('jwt=')[1]?.split(';')[0]);
  if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }
  
  if (!token || token === 'null' || token === 'undefined' || token.split('.').length !== 3) {
    console.error("MALFORMED TOKEN REJECTED:", token);
    throw new Error('Unauthorized');
  }
  
  token = token.replace(/^"|"$/g, '');
  
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
      const title = req.body.title;
      const slug = req.body.slug;
      const sections = req.body.content?.sections || req.body.sections || [];
      const seoTitle = req.body.content?.seoTitle || req.body.seoTitle || '';
      const seoDescription = req.body.content?.seoDescription || req.body.seoDescription || '';
      const seoKeywords = req.body.content?.seoKeywords || req.body.seoKeywords || '';
      const googleSchema = req.body.content?.googleSchema || req.body.googleSchema || {};

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
