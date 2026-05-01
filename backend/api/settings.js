module.exports = function(app, prisma, requireAuth) {
  // GET /api/settings
  app.get('/api/settings', async (req, res) => {
    try {
      const settings = await prisma.siteSettings.findUnique({
        where: { id: 1 }
      });
      res.json(settings || { id: 1, logoUrl: null, faviconUrl: null });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // POST /api/settings (Protected Route)
  app.post('/api/settings', requireAuth, async (req, res) => {
    try {
      // When an image URL is received from the frontend after a successful blob upload,
      // update the logoUrl or faviconUrl fields in the Neon database.
      const { logoUrl, faviconUrl } = req.body;
      
      const settings = await prisma.siteSettings.upsert({
        where: { id: 1 },
        update: { logoUrl, faviconUrl },
        create: { id: 1, logoUrl, faviconUrl }
      });

      res.json(settings);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // GET /api/settings/global
  app.get('/api/settings/global', async (req, res) => {
    try {
      const settings = await prisma.globalSettings.findUnique({
        where: { id: "1" }
      });
      res.json(settings || { id: "1", siteName: "ImmiHire", contactAddress: "", contactEmail: "", contactPhone: "", copyrightText: "", headerNav: [], footerNav: [] });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // PUT /api/settings/global (Protected Route)
  app.put('/api/settings/global', requireAuth, async (req, res) => {
    try {
      const { siteName, contactAddress, contactEmail, contactPhone, copyrightText, headerNav, footerNav, whatsappNumber, floatingSocialIcons } = req.body;
      
      const settings = await prisma.globalSettings.upsert({
        where: { id: "1" },
        update: { siteName, contactAddress, contactEmail, contactPhone, copyrightText, headerNav, footerNav, whatsappNumber, floatingSocialIcons },
        create: { id: "1", siteName, contactAddress, contactEmail, contactPhone, copyrightText, headerNav, footerNav, whatsappNumber, floatingSocialIcons }
      });

      res.json(settings);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });
};
