const express = require('express');
const { Groq } = require('groq-sdk');

const router = express.Router();

router.post('/generate', async (req, res) => {
  try {
    const { content } = req.body;
    
    if (!content) {
      return res.status(400).json({ error: 'Content is required for SEO generation.' });
    }

    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ error: 'GROQ_API_KEY is not configured.' });
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const systemPrompt = `You are an expert SEO specialist. Analyze the provided text and generate highly optimized, click-driven SEO metadata. 
You MUST output ONLY raw, valid JSON. No markdown formatting, no conversational text, no HTML tags.
The JSON must strictly follow this schema:
{
  "seoTitle": "string (less than 60 characters)",
  "seoDescription": "string (less than 160 characters)",
  "seoKeywords": "string (comma separated)"
}`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content }
      ],
      model: 'llama3-8b-8192',
      temperature: 0.3,
      response_format: { type: "json_object" }
    });

    const responseContent = chatCompletion.choices[0]?.message?.content;
    
    if (!responseContent) {
      throw new Error('No response from Groq API');
    }

    const seoData = JSON.parse(responseContent);
    res.json(seoData);
    
  } catch (error) {
    console.error('SEO Generation Error:', error);
    res.status(500).json({ error: 'Failed to generate SEO metadata.' });
  }
});

module.exports = router;
