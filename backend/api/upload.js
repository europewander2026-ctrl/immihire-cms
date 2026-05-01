const multer = require('multer');
const { put } = require('@vercel/blob');

// Use memory storage for serverless compatibility
const storage = multer.memoryStorage();
const upload = multer({ storage });

module.exports = function(app, prisma, requireAuth) {
  // POST /api/upload
  app.post('/api/upload', requireAuth, upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      // Allow frontend to specify a folder, default to "general"
      const folder = req.body.folder ? req.body.folder.replace(/^\/|\/$/g, '') : 'general';
      const filename = `${folder}/${Date.now()}-${req.file.originalname}`;
      
      const blob = await put(filename, req.file.buffer, {
        access: 'public',
        token: process.env.BLOB_READ_WRITE_TOKEN
      });

      res.json({ url: blob.url });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ error: 'Upload failed', details: error.message });
    }
  });
};
