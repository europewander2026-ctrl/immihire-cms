const multer = require('multer');
const { put } = require('@vercel/blob');

// Use memory storage for serverless compatibility
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 1024 * 1024 } // 1MB limit
});

module.exports = function(app, prisma, requireAuth) {
  // POST /api/upload
  const uploadSingle = upload.single('file');

  app.post('/api/upload', requireAuth, (req, res, next) => {
    uploadSingle(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ error: 'File size cannot exceed 1MB' });
        }
        return res.status(400).json({ error: err.message });
      } else if (err) {
        return res.status(500).json({ error: 'Unknown upload error' });
      }

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
  });
};
