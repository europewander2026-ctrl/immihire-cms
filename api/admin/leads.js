import { sql } from '../_utils/db.js';

export default async function handler(req, res) {
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.ADMIN_SECRET}`) {
    return res.status(401).json({ message: 'Unauthorized access' });
  }

  try {
    if (req.method === 'GET') {
      const leads = await sql`
        SELECT id, name, email, phone, subject, message, status, created_at 
        FROM leads 
        ORDER BY created_at DESC
      `;
      return res.status(200).json(leads);
    } 
    
    if (req.method === 'PUT') {
      const { id, status } = req.body;
      const updated = await sql`
        UPDATE leads SET status = ${status} WHERE id = ${id} RETURNING id, status
      `;
      return res.status(200).json(updated[0]);
    }

    return res.status(405).json({ message: 'Method Not Allowed' });
  } catch (error) {
    console.error('Leads API Error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
