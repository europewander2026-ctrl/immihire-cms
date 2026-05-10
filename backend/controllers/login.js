const prisma = require('../../utils/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { z } = require('zod');
const cookie = require('cookie');

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

module.exports = async function handler(req, res) {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const data = loginSchema.parse(req.body);
    
    const user = await prisma.adminUser.findUnique({ where: { email: data.email } });
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    if (!user.isActive) {
      return res.status(403).json({ error: 'Account disabled' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    
    res.setHeader('Set-Cookie', cookie.serialize('jwt', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 24 * 60 * 60, // 1 day
      path: '/'
    }));

    return res.status(200).json({ message: 'Logged in successfully', token });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error("Login error:", error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
