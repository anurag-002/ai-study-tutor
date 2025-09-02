import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertConversationSchema, insertMessageSchema } from "@shared/schema";
import multer from "multer";
import path from "path";
import fs from "fs";
import { groqService } from "./lib/groq";

// Configure multer for file uploads
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({
  dest: uploadDir,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPG, PNG, WebP, and PDF files are allowed.'));
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Create a new conversation
  app.post('/api/conversations', async (req, res) => {
    try {
      const data = insertConversationSchema.parse(req.body);
      const conversation = await storage.createConversation(data);
      res.json(conversation);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  // Get all conversations (for demo purposes)
  app.get('/api/conversations', async (req, res) => {
    try {
      // For demo, we'll get conversations for the demo user
      const conversations = await storage.getConversationsByUserId('demo-user');
      res.json(conversations);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get conversations for a user
  app.get('/api/conversations/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      const conversations = await storage.getConversationsByUserId(userId);
      res.json(conversations);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get messages for a conversation
  app.get('/api/conversations/:conversationId/messages', async (req, res) => {
    try {
      const { conversationId } = req.params;
      const messages = await storage.getMessagesByConversationId(conversationId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Send a message
  app.post('/api/messages', async (req, res) => {
    try {
      const data = insertMessageSchema.parse(req.body);
      const userMessage = await storage.createMessage(data);
      
      // Generate AI response
      let aiContent = '';
      try {
        aiContent = await groqService.generateResponse(data.content, data.imageUrl);
      } catch (error) {
        console.error('Groq API error:', error);
        aiContent = 'I apologize, but I encountered an error while processing your request. Please try again later.';
      }
      
      // Create AI response message
      const aiMessage = await storage.createMessage({
        conversationId: data.conversationId,
        content: aiContent,
        isUser: false,
        imageUrl: undefined,
      });

      res.json({ userMessage, aiMessage });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  // Upload image
  app.post('/api/upload', upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      // Generate a unique filename and move the file
      const fileExtension = path.extname(req.file.originalname);
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}${fileExtension}`;
      const filePath = path.join(uploadDir, fileName);
      
      fs.renameSync(req.file.path, filePath);
      
      const imageUrl = `/api/uploads/${fileName}`;
      res.json({ imageUrl });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Serve uploaded files
  app.get('/api/uploads/:filename', (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(uploadDir, filename);
    
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      res.status(404).json({ error: 'File not found' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
