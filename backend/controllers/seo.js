const express = require('express');
const { Groq } = require('groq-sdk');

const router = express.Router();

router.post('/generate', async (req, res) => {
  try {
    const { content, title, sections } = req.body;
    
    let aggregatedContent = content || "";
    
    // If sections are provided, aggregate all text content
    if (sections && Array.isArray(sections)) {
      const sectionTexts = sections.map(section => {
        const parts = [];
        if (section.heading) parts.push(section.heading);
        if (section.subheading) parts.push(section.subheading);
        if (section.data?.description) parts.push(section.data.description);
        if (section.data?.text) parts.push(section.data.text);
        if (section.data?.tagline) parts.push(section.data.tagline);
        if (section.content && typeof section.content === 'string') parts.push(section.content);
        return parts.join(" ");
      }).filter(Boolean);
      
      aggregatedContent = `Page Title: ${title || 'Untitled'}\n\nContent:\n${sectionTexts.join("\n\n")}`;
    }

    if (!aggregatedContent) {
      return res.status(400).json({ error: 'Content or sections are required for SEO generation.' });
    }

    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ error: 'GROQ_API_KEY is not configured.' });
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const systemPrompt = `You are an expert SEO specialist. Analyze the provided content and generate highly optimized SEO metadata and JSON-LD schema. 
Return ONLY a JSON object with four keys: 
1. "seoTitle": (max 60 chars)
2. "seoDescription": (max 160 chars)
3. "seoKeywords": (comma separated)
4. "googleSchema": (a valid JSON-LD string representing the page or article schema)

Return ONLY the raw JSON. No markdown formatting.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: aggregatedContent }
      ],
      model: 'llama-3.1-8b-instant',
      temperature: 0.3,
      response_format: { type: "json_object" }
    });

    let rawResponse = chatCompletion.choices[0]?.message?.content || '{}';
    const jsonString = rawResponse.replace(/```json/gi, '').replace(/```/g, '').trim();
    
    const seoData = JSON.parse(jsonString);
    res.json(seoData);
    
  } catch (error) {
    console.error('Groq SEO Error:', error);
    res.status(500).json({ error: 'Failed to generate SEO', details: error.message });
  }
});

module.exports = router;
