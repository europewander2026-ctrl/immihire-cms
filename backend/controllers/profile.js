module.exports = function(app, prisma, requireAuth) {
  // GET /api/profile
  app.get('/api/profile', requireAuth, async (req, res) => {
    try {
      const user = await prisma.adminUser.findUnique({
        where: { id: req.user.id },
        select: { id: true, email: true, name: true, profileImage: true, role: true }
      });
      if (!user) return res.status(404).json({ error: 'User not found' });
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // PUT /api/profile
  app.put('/api/profile', requireAuth, async (req, res) => {
    try {
      const { name, profileImage } = req.body;
      const user = await prisma.adminUser.update({
        where: { id: req.user.id },
        data: { name, profileImage },
        select: { id: true, email: true, name: true, profileImage: true, role: true }
      });
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update profile' });
    }
  });
};
