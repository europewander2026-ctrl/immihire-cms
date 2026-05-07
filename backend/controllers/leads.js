const prisma = require('../../utils/db');
const jwt = require('jsonwebtoken');

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
    requireAuth(req);

    if (req.method === 'GET') {
      const consultations = await prisma.consultation.findMany({
        orderBy: { createdAt: 'desc' }
      });
      return res.status(200).json(consultations);
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (error) {
    if (error.message === 'Unauthorized') return res.status(401).json({ error: 'Unauthorized' });
    console.error("Leads API error:", error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
