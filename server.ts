/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import multer from 'multer';

dotenv.config();

const upload = multer({ 
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  storage: multer.memoryStorage() 
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for Telegram Notification
  app.post('/api/register', upload.single('photo'), async (req, res) => {
    const { sscBatch, fullName, villageName, phoneNumber, occupation, tShirtSize, guestCount, transactionId, paymentMethod } = req.body;
    const photo = req.file;

    const message = `
🔔 *New Reunion Registration!*
━━━━━━━━━━━━━━━━━━
🎓 *SSC Batch:* ${sscBatch}
👤 *Full Name:* ${fullName}
🏡 *Village:* ${villageName}
📞 *Phone:* ${phoneNumber}
💼 *Occupation:* ${occupation || 'N/A'}
👕 *T-Shirt:* ${tShirtSize}
👥 *Guests:* ${guestCount}
💳 *Method:* ${paymentMethod || 'N/A'}
💰 *TxID:* \`${transactionId}\`
━━━━━━━━━━━━━━━━━━
`;

    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    // Check if credentials are placeholders or missing
    if (!BOT_TOKEN || !CHAT_ID || CHAT_ID === 'YOUR_CHAT_ID' || BOT_TOKEN === 'YOUR_BOT_TOKEN') {
      console.warn('Telegram credentials missing or not configured. Data received:', req.body);
      // Return success so the user can see the success state in the UI
      return res.json({ 
        success: true, 
        warning: 'Telegram not configured. Please set TELEGRAM_CHAT_ID in your environment.' 
      });
    }

    try {
      let telegramUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
      let body: any = {
        chat_id: CHAT_ID,
        text: message,
        parse_mode: 'Markdown',
      };

      if (photo) {
        telegramUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`;
        const formData = new FormData();
        formData.append('chat_id', CHAT_ID);
        formData.append('caption', message);
        formData.append('parse_mode', 'Markdown');
        
        // Convert buffer to Blob for fetch
        const blob = new Blob([photo.buffer], { type: photo.mimetype });
        formData.append('photo', blob, photo.originalname);

        const response = await fetch(telegramUrl, {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          return res.json({ success: true });
        } else {
          const errorData = await response.json();
          console.error('Telegram Photo API Error:', errorData);
          return res.status(500).json({ success: false, error: 'Failed to send photo' });
        }
      } else {
        const response = await fetch(telegramUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });

        if (response.ok) {
          res.json({ success: true });
        } else {
          const errorData = await response.json();
          console.error('Telegram API Error:', errorData);
          res.status(500).json({ success: false, error: 'Failed to send message' });
        }
      }
    } catch (error) {
      console.error('Server Error:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();
