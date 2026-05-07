const { parse } = require('json2csv');
const { sendMail } = require('../../utils/mailer');

module.exports = function(app, prisma, requireAuth) {
  // POST: Public endpoint to save consultation and send email
  app.post('/api/consultations', async (req, res) => {
    try {
      const { name, email, phone, service, message, sourceUrl } = req.body;
      
      // Save to database
      const consultation = await prisma.consultation.create({
        data: { name, email, phone, service, message, sourceUrl }
      });

      // Send email notification to Admin
      if (process.env.ADMIN_EMAIL && process.env.SMTP_USER) {
        await sendMail({
          to: process.env.ADMIN_EMAIL,
          subject: 'New Consultation Request',
          html: `
            <h2>New Consultation Request</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
            <p><strong>Service:</strong> ${service || 'N/A'}</p>
            <p><strong>Message:</strong><br/>${message}</p>
            <p><strong>Source URL:</strong> ${sourceUrl || 'N/A'}</p>
          `
        });
      }

      res.status(201).json({ message: 'Consultation request submitted successfully' });
    } catch (error) {
      console.error('Error creating consultation:', error);
      res.status(500).json({ error: 'Failed to submit consultation request' });
    }
  });

  // GET: Protected route for admin to list consultations
  app.get('/api/consultations', requireAuth, async (req, res) => {
    try {
      const consultations = await prisma.consultation.findMany({
        orderBy: { createdAt: 'desc' }
      });
      res.json(consultations);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch consultations' });
    }
  });

  // GET: Protected route to export consultations as CSV
  app.get('/api/consultations/export', requireAuth, async (req, res) => {
    try {
      const consultations = await prisma.consultation.findMany({
        orderBy: { createdAt: 'desc' }
      });

      const fields = ['id', 'name', 'email', 'phone', 'service', 'message', 'sourceUrl', 'createdAt'];
      const opts = { fields };
      const csv = parse(consultations, opts);

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="consultations.csv"');
      res.send(csv);
    } catch (error) {
      console.error('Error exporting consultations:', error);
      res.status(500).json({ error: 'Failed to export consultations' });
    }
  });
};
