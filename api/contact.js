const prisma = require('../utils/db');

module.exports = async function handler(req, res) {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email, and message are required.' });
    }

    const newLead = await prisma.consultation.create({
      data: {
        name,
        email,
        phone,
        service: subject || 'General Inquiry',
        message,
      },
    });

    return res.status(200).json({ success: true, lead: newLead });
  } catch (error) {
    console.error('Lead capture error:', error);
    return res.status(500).json({ message: 'Failed to submit consultation request' });
  }
}
