import { put } from '@vercel/blob';

export const config = {
  api: {
    bodyParser: false, // Required for streaming file uploads to Vercel Blob
  },
};

export default async function handler(req, res) {
  // Authorization check
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.ADMIN_SECRET}`) {
    return res.status(401).json({ message: 'Unauthorized access' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const filename = req.query.filename || 'uploaded-image.webp';
    const blob = await put(filename, req, {
      access: 'public',
    });
    return res.status(200).json({ url: blob.url });
  } catch (error) {
    console.error('Upload Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
