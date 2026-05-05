import { sql } from './_utils/db.js';

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { name, email, phone, subject, message } = req.body;

    // Basic validation
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email, and message are required.' });
    }

    // Insert into leads table
    const result = await sql`
      INSERT INTO leads (name, email, phone, subject, message, status)
      VALUES (${name}, ${email}, ${phone || null}, ${subject || 'General Inquiry'}, ${message}, 'New')
      RETURNING id, name, email, created_at
    `;

    return res.status(201).json({
      message: 'Your inquiry has been submitted successfully.',
      lead: result[0]
    });
  } catch (error) {
    console.error('Contact API Error:', error);
    return res.status(500).json({ message: 'Internal Server Error. Please try again later.' });
  }
}
