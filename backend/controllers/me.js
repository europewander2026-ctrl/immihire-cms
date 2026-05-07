const prisma = require('../../utils/db');
const jwt = require('jsonwebtoken');

module.exports = async function handler(req, res) {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const token = req.cookies?.jwt || req.headers.cookie?.split('jwt=')[1]?.split(';')[0];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await prisma.adminUser.findUnique({ 
      where: { id: decoded.id },
      select: { id: true, email: true, role: true, isActive: true, name: true, profileImage: true }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!user.isActive) {
      return res.status(403).json({ error: 'Account disabled' });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("Session validation error:", error);
    return res.status(401).json({ error: 'Invalid token' });
  }
}
