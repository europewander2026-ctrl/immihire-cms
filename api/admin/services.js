module.exports = function(app, prisma, requireAuth) {
  // GET all services
  app.get('/api/services', async (req, res) => {
    try {
      const services = await prisma.service.findMany({
        orderBy: { createdAt: 'desc' }
      });
      res.json(services);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // GET service by slug
  app.get('/api/services/:slug', async (req, res) => {
    try {
      const service = await prisma.service.findUnique({
        where: { slug: req.params.slug }
      });
      if (!service) return res.status(404).json({ error: 'Service not found' });
      res.json(service);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // POST create service
  app.post('/api/services', requireAuth, async (req, res) => {
    try {
      const service = await prisma.service.create({
        data: req.body
      });
      res.status(201).json(service);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create service' });
    }
  });

  // PUT update service
  app.put('/api/services/:slug', requireAuth, async (req, res) => {
    try {
      const service = await prisma.service.update({
        where: { slug: req.params.slug },
        data: req.body
      });
      res.json(service);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update service' });
    }
  });

  // DELETE service
  app.delete('/api/services/:slug', requireAuth, async (req, res) => {
    try {
      await prisma.service.delete({
        where: { slug: req.params.slug }
      });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete service' });
    }
  });
};
