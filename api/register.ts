import type { VercelRequest, VercelResponse } from '@vercel/node';
import Busboy from 'busboy';
import FormData from 'form-data';

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

  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || process.env.VITE_TELEGRAM_BOT_TOKEN || "8624730650:AAGezhEM3IVKD5xGg-m5JnQ0FZfmtn7upR0";
  const CHAT_ID = process.env.TELEGRAM_CHAT_ID || process.env.VITE_TELEGRAM_CHAT_ID || "7228630025";

  if (!BOT_TOKEN || !CHAT_ID) {
    return response.status(200).json({ success: true, warning: 'Telegram not configured' });
  }

  const busboy = Busboy({ headers: request.headers });
  const fields: any = {};
  let photoBuffer: Buffer | null = null;
  let photoName = '';
  let photoMime = '';

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
        file.on('data', (chunk) => chunks.push(chunk));
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
(Sent via Vercel Function)
`;

      try {
        if (photoBuffer) {
          const form = new FormData();
          form.append('chat_id', CHAT_ID);
          form.append('photo', photoBuffer, { filename: photoName, contentType: photoMime });
          form.append('caption', message);
          form.append('parse_mode', 'Markdown');

          const tgRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
            method: 'POST',
            headers: form.getHeaders(),
            body: form as any,
          });
          
          if (!tgRes.ok) {
            const errText = await tgRes.text();
            console.error('Telegram sendPhoto error:', errText);
            throw new Error(`Telegram sendPhoto failed: ${tgRes.statusText}`);
          }
        } else {
          const tgRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: CHAT_ID,
              text: message,
              parse_mode: 'Markdown',
            }),
          });
          
          if (!tgRes.ok) {
             const errText = await tgRes.text();
             console.error('Telegram sendMessage error:', errText);
             throw new Error(`Telegram sendMessage failed: ${tgRes.statusText}`);
          }
        }

        response.status(200).json({ success: true });
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
