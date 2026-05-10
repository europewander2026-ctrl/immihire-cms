module.exports = function(app, prisma, requireAuth) {
  // GET all insights
  app.get('/api/insights', async (req, res) => {
    try {
      const insights = await prisma.insight.findMany({
        orderBy: { createdAt: 'desc' }
      });
      res.json(insights);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // GET insight by slug
  app.get('/api/insights/:slug', async (req, res) => {
    try {
      const insight = await prisma.insight.findUnique({
        where: { slug: req.params.slug }
      });
      if (!insight) return res.status(404).json({ error: 'Insight not found' });
      res.json(insight);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // POST create insight
  app.post('/api/insights', requireAuth, async (req, res) => {
    try {
      const { title, slug, excerpt, sections, author, featuredImage, category, featured, isPublished, status, seoTitle, seoDescription, seoKeywords } = req.body;
      const insight = await prisma.insight.create({
        data: { title, slug, excerpt, sections, author, featuredImage, category, featured, isPublished, status, seoTitle, seoDescription, seoKeywords }
      });
      res.status(201).json(insight);
    } catch (error) {
      if (error.code === 'P2002') {
        return res.status(400).json({ error: 'Slug already exists' });
      }
      console.error('Create insight error:', error);
      res.status(500).json({ error: error.message || 'Failed to create insight' });
    }
  });

  // PUT update insight
  app.put('/api/insights/:slug', requireAuth, async (req, res) => {
    try {
      const { title, slug, excerpt, sections, author, featuredImage, category, featured, isPublished, status, seoTitle, seoDescription, seoKeywords } = req.body;
      const insight = await prisma.insight.update({
        where: { slug: req.params.slug },
        data: { title, slug, excerpt, sections, author, featuredImage, category, featured, isPublished, status, seoTitle, seoDescription, seoKeywords }
      });
      res.json(insight);
    } catch (error) {
      if (error.code === 'P2002') {
        return res.status(400).json({ error: 'Slug already exists' });
      }
      console.error('Update insight error:', error);
      res.status(500).json({ error: error.message || 'Failed to update insight' });
    }
  });

  // DELETE insight
  app.delete('/api/insights/:slug', requireAuth, async (req, res) => {
    try {
      await prisma.insight.delete({
        where: { slug: req.params.slug }
      });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete insight' });
    }
  });
};
