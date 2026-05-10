const { put } = require('@vercel/blob');
const jwt = require('jsonwebtoken');
const formidable = require('formidable');
const fs = require('fs');

export const config = {
  api: {
    bodyParser: false,
  },
};

const requireAuth = (req) => {
  let token = req.cookies?.jwt || (req.headers.cookie && req.headers.cookie.split('jwt=')[1]?.split(';')[0]);
  if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }
  
  if (!token || token === 'null' || token === 'undefined') {
    throw new Error('Unauthorized');
  }
  
  // Remove any stray quotes that might have snuck through
  token = token.replace(/^"|"$/g, '');
  
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = async function handler(req, res) {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    requireAuth(req);

    const form = new formidable.IncomingForm();
    return new Promise((resolve, reject) => {
      form.parse(req, async (err, fields, files) => {
        if (err) return resolve(res.status(500).json({ error: 'Upload failed' }));

        const file = files.file[0] || files.file;
        if (!file) return resolve(res.status(400).json({ error: 'No file uploaded' }));

        let folder = fields.folder ? fields.folder[0] || fields.folder : 'general';
        const filename = `${folder}/${Date.now()}-${file.originalFilename}`;

        const blob = await put(filename, fs.createReadStream(file.filepath), {
          access: 'public',
          contentType: file.mimetype,
        });

        resolve(res.status(200).json({ url: blob.url }));
      });
    });
  } catch (error) {
    if (error.message === 'Unauthorized') return res.status(401).json({ error: 'Unauthorized' });
    console.error("Upload error:", error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
