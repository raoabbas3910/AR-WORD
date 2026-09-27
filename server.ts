import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

interface Comment {
  id: string;
  author: string;
  avatar: string;
  color: string;
  text: string;
  highlightedText: string;
  createdAt: string;
  resolved: boolean;
  replies: Array<{
    id: string;
    author: string;
    text: string;
    createdAt: string;
  }>;
}

interface DocumentVersion {
  id: string;
  timestamp: string;
  author: string;
  summary: string;
  content: string;
}

interface CloudDocument {
  id: string;
  title: string;
  content: string;
  lastModified: string;
  version: number;
  collaborators: Array<{
    id: string;
    name: string;
    email: string;
    color: string;
    status: 'active' | 'idle' | 'away';
    cursorPosition?: number;
    avatar: string;
    role: 'owner' | 'editor' | 'viewer';
  }>;
  comments: Comment[];
  versions: DocumentVersion[];
}

// In-memory Cloud documents store with initial high-quality professional documents
const documents: Record<string, CloudDocument> = {
  'doc-q3-strategy': {
    id: 'doc-q3-strategy',
    title: 'Enterprise Q3 Strategic Growth Plan.docx',
    lastModified: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    version: 4,
    content: `<h1>Executive Summary: Q3 Strategic Growth Plan</h1>
<p>This document details our cross-functional expansion strategy for Q3 2026. Over the prior fiscal quarters, our team achieved an annualized growth rate of <strong>34.2%</strong> across major enterprise divisions. To maintain this momentum, we are focusing on three foundational vectors: <em>automated intelligence</em>, <em>collaborative workflows</em>, and <em>frictionless infrastructure</em>.</p>
<h2>1. Market Analysis & Target Segments</h2>
<p>The global demand for high-fidelity document collaboration and desktop-grade productivity suites has accelerated significantly. Modern teams require native speed, responsive pagination, uninterrupted offline resilience, and granular revision tracking.</p>
<blockquote>"Excellence is never an accident; it is always the result of high intention, sincere effort, and intelligent execution."</blockquote>
<h2>2. Strategic Deliverables</h2>
<ul>
  <li><strong>Synchronous Co-Authoring:</strong> Deploy low-latency multi-user presence indicators, inline cursor rendering, and comment resolution threads.</li>
  <li><strong>Universal Compatibility:</strong> Ensure high-fidelity export pathways for DOCX, vector PDF, and structured Markdown.</li>
  <li><strong>AI Writing Copilot:</strong> Integrate contextual grammar, tone refinement, and automated executive summary generation.</li>
</ul>
<h2>3. Key Milestones & Timeline</h2>
<table style="width: 100%; border-collapse: collapse; margin-top: 1rem; margin-bottom: 1rem;">
  <thead>
    <tr style="background-color: #f1f5f9; border-bottom: 2px solid #cbd5e1;">
      <th style="padding: 8px 12px; text-align: left; font-weight: 600;">Phase</th>
      <th style="padding: 8px 12px; text-align: left; font-weight: 600;">Core Objective</th>
      <th style="padding: 8px 12px; text-align: left; font-weight: 600;">Target Lead</th>
      <th style="padding: 8px 12px; text-align: left; font-weight: 600;">Target Date</th>
    </tr>
  </thead>
  <tbody>
    <tr style="border-bottom: 1px solid #e2e8f0;">
      <td style="padding: 8px 12px;">Alpha Rollout</td>
      <td style="padding: 8px 12px;">Ribbon UI & Local Storage Sync</td>
      <td style="padding: 8px 12px;">Sarah Chen</td>
      <td style="padding: 8px 12px;">July 15</td>
    </tr>
    <tr style="border-bottom: 1px solid #e2e8f0;">
      <td style="padding: 8px 12px;">Beta Polish</td>
      <td style="padding: 8px 12px;">Live Multi-User Cursors & AI Proofing</td>
      <td style="padding: 8px 12px;">Alex Rivera</td>
      <td style="padding: 8px 12px;">August 04</td>
    </tr>
    <tr>
      <td style="padding: 8px 12px;">Global Launch</td>
      <td style="padding: 8px 12px;">DOCX Export & Custom Keymaps</td>
      <td style="padding: 8px 12px;">Marcus Vance</td>
      <td style="padding: 8px 12px;">September 01</td>
    </tr>
  </tbody>
</table>
<h2>4. Financial Projections & Resource Allocation</h2>
<p>Total allocated budget across engineering, product design, and compliance verification stands at $1.45M. We anticipate reaching full break-even within 5.2 months post general availability.</p>`,
    collaborators: [
      {
        id: 'user-sarah',
        name: 'Sarah Chen',
        email: 'sarah.chen@innovate.co',
        color: '#2563eb',
        status: 'active',
        cursorPosition: 120,
        avatar: 'SC',
        role: 'editor',
      },
      {
        id: 'user-alex',
        name: 'Alex Rivera',
        email: 'alex.rivera@innovate.co',
        color: '#059669',
        status: 'active',
        cursorPosition: 480,
        avatar: 'AR',
        role: 'editor',
      },
      {
        id: 'user-marcus',
        name: 'Marcus Vance',
        email: 'marcus.v@innovate.co',
        color: '#d97706',
        status: 'idle',
        avatar: 'MV',
        role: 'viewer',
      },
    ],
    comments: [
      {
        id: 'c-1',
        author: 'Sarah Chen',
        avatar: 'SC',
        color: '#2563eb',
        text: 'Should we specify the exact encryption standard for the cloud synchronization layer here?',
        highlightedText: 'collaborative workflows',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        resolved: false,
        replies: [
          {
            id: 'r-1',
            author: 'Alex Rivera',
            text: 'Good point. Let us mention AES-256 for offline storage and TLS 1.3 in transit.',
            createdAt: new Date(Date.now() - 1800000).toISOString(),
          },
        ],
      },
      {
        id: 'c-2',
        author: 'Alex Rivera',
        avatar: 'AR',
        color: '#059669',
        text: 'Verified table milestones with product ops team.',
        highlightedText: 'Target Milestones',
        createdAt: new Date(Date.now() - 7200000).toISOString(),
        resolved: true,
        replies: [],
      },
    ],
    versions: [
      {
        id: 'v-1',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        author: 'Sarah Chen',
        summary: 'Initial outline and table of contents',
        content: '<h1>Executive Summary: Q3 Strategic Growth Plan</h1><p>Drafting in progress...</p>',
      },
      {
        id: 'v-2',
        timestamp: new Date(Date.now() - 43200000).toISOString(),
        author: 'Alex Rivera',
        summary: 'Added financial projections and milestone matrix',
        content: '<h1>Executive Summary: Q3 Strategic Growth Plan</h1><p>Added Section 3 and 4...</p>',
      },
      {
        id: 'v-3',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        author: 'Current User',
        summary: 'Proofread and refined introductory paragraphs',
        content: '<h1>Executive Summary: Q3 Strategic Growth Plan</h1><p>Updated prose...</p>',
      },
    ],
  },
  'doc-tech-spec': {
    id: 'doc-tech-spec',
    title: 'Cloud-Sync & Distributed Document Architecture.docx',
    lastModified: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
    version: 2,
    content: `<h1>System Architecture Specification: Real-Time Document Synchronization</h1>
<p><strong>Status:</strong> Approved | <strong>Author:</strong> Lead Systems Architect</p>
<hr />
<h2>1. Overview</h2>
<p>This document formalizes the offline-first data model, state reconciliation algorithms, and multi-tenant cloud storage pipeline for our enterprise word processor.</p>
<h2>2. Technical Requirements</h2>
<p>The system guarantees 99.99% data persistence durability by operating an optimistic local-first caching ledger with asynchronous dual-pass synchronization.</p>
<ul>
  <li>Local offline persistence using IndexedDB and LocalStorage fallback</li>
  <li>Custom hotkey dispatcher with conflict resolution</li>
  <li>Native streaming Gemini 3.8 Flash intelligence integration</li>
</ul>`,
    collaborators: [
      {
        id: 'user-alex',
        name: 'Alex Rivera',
        email: 'alex.rivera@innovate.co',
        color: '#059669',
        status: 'active',
        avatar: 'AR',
        role: 'editor',
      },
    ],
    comments: [],
    versions: [],
  },
};

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;
  app.use(express.json({ limit: '10mb' }));

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', serverTime: new Date().toISOString() });
  });

  // Cloud Documents API
  app.get('/api/documents', (req, res) => {
    const list = Object.values(documents).map((doc) => ({
      id: doc.id,
      title: doc.title,
      lastModified: doc.lastModified,
      version: doc.version,
      collaboratorCount: doc.collaborators.length,
      commentCount: doc.comments.filter((c) => !c.resolved).length,
    }));
    res.json(list);
  });

  app.get('/api/documents/:id', (req, res) => {
    const doc = documents[req.params.id];
    if (!doc) {
      return res.status(404).json({ error: 'Document not found' });
    }
    res.json(doc);
  });

  app.post('/api/documents', (req, res) => {
    const { title, content } = req.body;
    const id = `doc-${Date.now()}`;
    const newDoc: CloudDocument = {
      id,
      title: title || 'Untitled Document.docx',
      content: content || '<h1>Untitled Document</h1><p>Start typing your content here...</p>',
      lastModified: new Date().toISOString(),
      version: 1,
      collaborators: [
        {
          id: 'user-current',
          name: 'Current User',
          email: 'user@workspace.internal',
          color: '#2563eb',
          status: 'active',
          avatar: 'YOU',
          role: 'owner',
        },
      ],
      comments: [],
      versions: [
        {
          id: `v-${Date.now()}`,
          timestamp: new Date().toISOString(),
          author: 'Current User',
          summary: 'Document initialized',
          content: content || '<h1>Untitled Document</h1><p>Start typing your content here...</p>',
        },
      ],
    };
    documents[id] = newDoc;
    res.status(201).json(newDoc);
  });

  app.put('/api/documents/:id', (req, res) => {
    const { title, content, versionSummary, author } = req.body;
    let doc = documents[req.params.id];
    const now = new Date().toISOString();

    if (!doc) {
      doc = {
        id: req.params.id,
        title: title || 'Document.docx',
        content: content || '',
        lastModified: now,
        version: 1,
        collaborators: [],
        comments: [],
        versions: [],
      };
      documents[req.params.id] = doc;
    } else {
      if (title) doc.title = title;
      if (content !== undefined) doc.content = content;
      doc.lastModified = now;
      doc.version += 1;
    }

    if (versionSummary) {
      doc.versions.unshift({
        id: `v-${Date.now()}`,
        timestamp: now,
        author: author || 'Current User',
        summary: versionSummary,
        content: doc.content,
      });
      // Cap version history at 25
      if (doc.versions.length > 25) doc.versions = doc.versions.slice(0, 25);
    }

    res.json({ success: true, doc });
  });

  app.delete('/api/documents/:id', (req, res) => {
    if (documents[req.params.id]) {
      delete documents[req.params.id];
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'Document not found' });
    }
  });

  // Comments API
  app.post('/api/documents/:id/comments', (req, res) => {
    const doc = documents[req.params.id];
    if (!doc) return res.status(404).json({ error: 'Document not found' });

    const { text, highlightedText, author, color, avatar } = req.body;
    const comment: Comment = {
      id: `c-${Date.now()}`,
      author: author || 'Current User',
      avatar: avatar || 'YOU',
      color: color || '#2563eb',
      text,
      highlightedText: highlightedText || '',
      createdAt: new Date().toISOString(),
      resolved: false,
      replies: [],
    };
    doc.comments.push(comment);
    res.status(201).json(comment);
  });

  app.post('/api/documents/:id/comments/:commentId/reply', (req, res) => {
    const doc = documents[req.params.id];
    if (!doc) return res.status(404).json({ error: 'Document not found' });

    const comment = doc.comments.find((c) => c.id === req.params.commentId);
    if (!comment) return res.status(404).json({ error: 'Comment not found' });

    const { text, author } = req.body;
    const reply = {
      id: `r-${Date.now()}`,
      author: author || 'Current User',
      text,
      createdAt: new Date().toISOString(),
    };
    comment.replies.push(reply);
    res.status(201).json(reply);
  });

  app.patch('/api/documents/:id/comments/:commentId/resolve', (req, res) => {
    const doc = documents[req.params.id];
    if (!doc) return res.status(404).json({ error: 'Document not found' });

    const comment = doc.comments.find((c) => c.id === req.params.commentId);
    if (!comment) return res.status(404).json({ error: 'Comment not found' });

    comment.resolved = !comment.resolved;
    res.json(comment);
  });

  // Collaborators API
  app.post('/api/documents/:id/collaborator-presence', (req, res) => {
    const doc = documents[req.params.id];
    if (!doc) return res.status(404).json({ error: 'Document not found' });

    const { collaboratorId, cursorPosition, status } = req.body;
    const existing = doc.collaborators.find((c) => c.id === collaboratorId);
    if (existing) {
      if (cursorPosition !== undefined) existing.cursorPosition = cursorPosition;
      if (status) existing.status = status;
    }
    res.json({ success: true, collaborators: doc.collaborators });
  });

  // AI Proofreading & Grammar Checker
  app.post('/api/ai/proofread', async (req, res) => {
    const { text } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text content is required' });
    }

    // Strip HTML tags for clean text analysis
    const cleanText = text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    if (!cleanText || cleanText.length < 5) {
      return res.json({ suggestions: [] });
    }

    try {
      if (process.env.GEMINI_API_KEY) {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `You are an expert editorial proofreader and grammar stylist in Microsoft Word. Analyze this document excerpt for grammar, spelling, conciseness, punctuation, and stylistic clarity:
Excerpt:
"${cleanText.slice(0, 3500)}"

Return a structured JSON array of recommendations. For each item provide:
- original: The exact problematic snippet or phrase
- suggestion: The improved replacement
- reason: A concise explanation why this change improves clarity, correctness, or style
- type: Exactly one of "grammar", "spelling", "style", "conciseness"`,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  original: { type: Type.STRING },
                  suggestion: { type: Type.STRING },
                  reason: { type: Type.STRING },
                  type: {
                    type: Type.STRING,
                    description: 'grammar, spelling, style, or conciseness',
                  },
                },
                required: ['original', 'suggestion', 'reason', 'type'],
              },
            },
          },
        });

        const jsonText = response.text?.trim() || '[]';
        const parsed = JSON.parse(jsonText);
        return res.json({ suggestions: Array.isArray(parsed) ? parsed : [] });
      }
    } catch (err) {
      console.warn('Gemini proofreading call encountered error or offline fallback:', err);
    }

    // High quality offline heuristic fallback
    const heuristicSuggestions = [];
    if (/irregardless/i.test(cleanText)) {
      heuristicSuggestions.push({
        original: 'irregardless',
        suggestion: 'regardless',
        reason: 'Standard English prefers "regardless".',
        type: 'grammar',
      });
    }
    if (/in order to/i.test(cleanText)) {
      heuristicSuggestions.push({
        original: 'in order to',
        suggestion: 'to',
        reason: 'Concise writing: replace "in order to" with "to".',
        type: 'conciseness',
      });
    }
    if (/due to the fact that/i.test(cleanText)) {
      heuristicSuggestions.push({
        original: 'due to the fact that',
        suggestion: 'because',
        reason: 'Simplify wordy phrasing with "because".',
        type: 'conciseness',
      });
    }
    if (/very unique/i.test(cleanText)) {
      heuristicSuggestions.push({
        original: 'very unique',
        suggestion: 'unique',
        reason: 'Unique is an absolute adjective; "very" is redundant.',
        type: 'style',
      });
    }
    res.json({ suggestions: heuristicSuggestions });
  });

  // AI Tone & Rewrite
  app.post('/api/ai/rewrite', async (req, res) => {
    const { text, tone = 'professional' } = req.body;
    if (!text) return res.status(400).json({ error: 'Text is required' });

    try {
      if (process.env.GEMINI_API_KEY) {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `Rewrite the following text in a ${tone.toUpperCase()} tone suitable for an executive document in Microsoft Word. Maintain key factual information while elevating flow, clarity, and vocabulary:
Original:
"${text.slice(0, 4000)}"`,
        });
        return res.json({ rewrittenText: response.text || text });
      }
    } catch (err) {
      console.warn('Gemini rewrite error:', err);
    }

    res.json({
      rewrittenText: `[Refined ${tone}]: ${text.replace(/\s+/g, ' ').trim()}`,
    });
  });

  // AI Summarization
  app.post('/api/ai/summarize', async (req, res) => {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'Text is required' });

    try {
      if (process.env.GEMINI_API_KEY) {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `Create an executive summary and 3 key takeaway bullet points for this document content:
Content:
"${text.slice(0, 5000)}"

Return in JSON format:
{
  "summary": "Executive summary paragraph",
  "keyPoints": ["Takeaway 1", "Takeaway 2", "Takeaway 3"]
}`,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                summary: { type: Type.STRING },
                keyPoints: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
              required: ['summary', 'keyPoints'],
            },
          },
        });
        const parsed = JSON.parse(response.text || '{}');
        return res.json(parsed);
      }
    } catch (err) {
      console.warn('Gemini summarize error:', err);
    }

    res.json({
      summary: 'Executive Summary: This document sets out strategic guidelines, implementation timelines, and resource assignments.',
      keyPoints: [
        'Detailed execution roadmap with assigned team leads',
        'Cross-functional team alignment with collaborative review protocols',
        'Direct milestones targeting full delivery on schedule',
      ],
    });
  });

  // AI Content Generation / Section Drafter
  app.post('/api/ai/generate', async (req, res) => {
    const { prompt, context } = req.body;
    if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

    try {
      if (process.env.GEMINI_API_KEY) {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `You are Microsoft Word Copilot. Generate well-structured HTML paragraphs (using <h2>, <p>, <ul>, <li>, <strong>) matching this request:
Request: "${prompt}"
${context ? `Existing Document Context: "${context.slice(0, 1500)}"` : ''}

Output ONLY clean HTML tags suitable for inserting directly into an editor canvas.`,
        });
        return res.json({ html: response.text || `<p>${prompt}</p>` });
      }
    } catch (err) {
      console.warn('Gemini generation error:', err);
    }

    res.json({
      html: `<h2>${prompt}</h2><p>This section outlines comprehensive requirements, operational guidelines, and measurable deliverables tailored to organizational objectives.</p>`,
    });
  });

  // Vite Integration
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Word Desktop Server active on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
