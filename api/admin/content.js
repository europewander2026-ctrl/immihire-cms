import { sql } from '../_utils/db.js';

export default async function handler(req, res) {
  // Basic security check
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.ADMIN_SECRET}`) {
    return res.status(401).json({ message: 'Unauthorized access' });
  }

  try {
    if (req.method === 'POST') {
      // Create new content
      const { type, slug, title, hero_image_url, content } = req.body;
      
      // JSON payload comes in as an object/array, stringify it for Neon's JSONB
      const result = await sql`
        INSERT INTO content (type, slug, title, hero_image_url, content)
        VALUES (${type}, ${slug}, ${title}, ${hero_image_url}, ${JSON.stringify(content)}::jsonb)
        RETURNING id, slug
      `;
      return res.status(201).json({ message: 'Content created', data: result[0] });
    } 
    
    else if (req.method === 'PUT') {
      // Update existing content
      const { id, type, slug, title, hero_image_url, content } = req.body;
      
      const result = await sql`
        UPDATE content 
        SET type = ${type}, slug = ${slug}, title = ${title}, 
            hero_image_url = ${hero_image_url}, content = ${JSON.stringify(content)}::jsonb,
            updated_at = NOW()
        WHERE id = ${id}
        RETURNING id, slug
      `;
      return res.status(200).json({ message: 'Content updated', data: result[0] });
    }

    else if (req.method === 'DELETE') {
      // Delete content
      const { id } = req.query;
      await sql`DELETE FROM content WHERE id = ${id}`;
      return res.status(200).json({ message: 'Content deleted successfully' });
    }

    return res.status(405).json({ message: 'Method Not Allowed' });

  } catch (error) {
    console.error('Admin API Error:', error);
    // Handle unique slug constraint errors specifically
    if (error.code === '23505') {
      return res.status(400).json({ message: 'A page with this slug already exists.' });
    }
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
