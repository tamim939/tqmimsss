import type { VercelRequest, VercelResponse } from '@vercel/node';

// This is a simple Vercel-compatible API route
export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  // Note: Vercel Serverless Functions handle body parsing, 
  // but multipart/form-data (photos) requires extra libraries like 'formidable'.
  // For now, we will handle the text data to at least get the registration info.
  
  const { 
    sscBatch, fullName, villageName, phoneNumber, 
    occupation, tShirtSize, guestCount, 
    transactionId, paymentMethod 
  } = request.body;

  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || process.env.VITE_TELEGRAM_BOT_TOKEN;
  const CHAT_ID = process.env.TELEGRAM_CHAT_ID || process.env.VITE_TELEGRAM_CHAT_ID;

  if (!BOT_TOKEN || !CHAT_ID) {
    return response.status(200).json({ success: true, warning: 'Telegram not configured' });
  }

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
(Sent via Vercel Function)
`;

  try {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: 'Markdown',
      }),
    });

    return response.status(200).json({ success: true });
  } catch (error) {
    console.error('Telegram Error:', error);
    return response.status(200).json({ success: true, error: 'Telegram send failed' });
  }
}
