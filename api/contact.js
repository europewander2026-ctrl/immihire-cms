const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

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
    
    // We use the Consultation model as defined in schema.prisma
    // Mapping 'subject' to 'service' as the schema doesn't have a 'status' or 'subject' field
    const newLead = await prisma.consultation.create({
      data: { 
        name, 
        email, 
        phone, 
        service: subject || 'General Inquiry', 
        message 
      }
    });

    return res.status(200).json({ success: true, lead: newLead });
  } catch (error) {
    console.error("Lead capture error:", error);
    return res.status(500).json({ message: 'Failed to submit consultation request' });
  }
};
