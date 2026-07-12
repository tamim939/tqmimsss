import type { VercelRequest, VercelResponse } from '@vercel/node';
import Busboy from 'busboy';
import FormData from 'form-data';
import fetch from 'node-fetch';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  // Use provided tokens or fallback to hardcoded ones
  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || process.env.VITE_TELEGRAM_BOT_TOKEN || "8624730650:AAGezhEM3IVKD5xGg-m5JnQ0FZfmtn7upR0";
  const CHAT_ID = process.env.TELEGRAM_CHAT_ID || process.env.VITE_TELEGRAM_CHAT_ID || "7228630025";

  const busboy = Busboy({ headers: request.headers });
  const fields: any = {};
  let photoBuffer: Buffer | null = null;
  let photoName = 'photo.jpg';
  let photoMime = 'image/jpeg';

  return new Promise((resolve) => {
    busboy.on('field', (name, val) => {
      fields[name] = val;
    });

    busboy.on('file', (name, file, info) => {
      const { filename, mimeType } = info;
      if (name === 'photo') {
        photoName = filename;
        photoMime = mimeType;
        const chunks: any[] = [];
        file.on('data', (chunk) => {
          chunks.push(chunk);
        });
        file.on('end', () => {
          photoBuffer = Buffer.concat(chunks);
        });
      } else {
        file.resume();
      }
    });

    busboy.on('finish', async () => {
      const message = `
🔔 *New Reunion Registration!*
━━━━━━━━━━━━━━━━━━
🎓 *SSC Batch:* ${fields.sscBatch || 'N/A'}
👤 *Full Name:* ${fields.fullName || 'N/A'}
🏡 *Village:* ${fields.villageName || 'N/A'}
📞 *Phone:* ${fields.phoneNumber || 'N/A'}
💼 *Occupation:* ${fields.occupation || 'N/A'}
👕 *T-Shirt:* ${fields.tShirtSize || 'N/A'}
👥 *Guests:* ${fields.guestCount || 'N/A'}
💰 *Total Fee:* ${fields.totalFee || 'N/A'}
💳 *Method:* ${fields.paymentMethod || 'N/A'}
🎫 *TxID:* \`${fields.transactionId || 'N/A'}\`
━━━━━━━━━━━━━━━━━━
`;

      try {
        let success = false;
        if (photoBuffer && photoBuffer.length > 0) {
          const form = new FormData();
          form.append('chat_id', CHAT_ID);
          form.append('photo', photoBuffer, { 
            filename: photoName, 
            contentType: photoMime,
            knownLength: photoBuffer.length 
          });
          form.append('caption', message);
          form.append('parse_mode', 'Markdown');

          const tgRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
            method: 'POST',
            body: form,
            headers: form.getHeaders()
          });
          
          if (tgRes.ok) {
            success = true;
          } else {
            const errText = await tgRes.text();
            console.error('Telegram sendPhoto error:', errText);
            // Fallback to text if photo fails
          }
        }

        if (!success) {
          const tgRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: CHAT_ID,
              text: message,
              parse_mode: 'Markdown',
            }),
          });
          
          if (tgRes.ok) {
            success = true;
          } else {
             const errText = await tgRes.text();
             console.error('Telegram sendMessage error:', errText);
          }
        }

        if (success) {
          response.status(200).json({ success: true });
        } else {
          response.status(500).json({ success: false, error: 'Failed to send to Telegram' });
        }
      } catch (error: any) {
        console.error('Registration Error:', error);
        response.status(500).json({ success: false, error: error.message });
      }
      resolve(null);
    });

    busboy.on('error', (err) => {
      console.error('Busboy error:', err);
      response.status(500).json({ success: false, error: 'Form parsing failed' });
      resolve(null);
    });

    request.pipe(busboy);
  });
}
