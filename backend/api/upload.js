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
      let folder = req.body.folder ? req.body.folder.replace(/^\/|\/$/g, '') : 'general';
      const allowedFolders = ['logos', 'profiles', 'services', 'general'];
      if (!allowedFolders.includes(folder)) {
        folder = 'general';
      }
      const filename = `${folder}/${Date.now()}-${req.file.originalname}`;
      
      const blob = await put(filename, req.file.buffer, {
        access: 'public', // Explicitly request a public URL
        contentType: req.file.mimetype,
        addRandomSuffix: true,
      });

      res.json({ url: blob.url });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ error: 'Upload failed', details: error.message });
    }
  });
};
