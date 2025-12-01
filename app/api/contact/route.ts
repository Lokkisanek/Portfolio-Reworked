import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const messagesPath = path.join(process.cwd(), 'data', 'contact-messages.json');
const defaultRecipient = 'odehnalm.08@spst.eu';
const defaultSender = 'Portfolio Contact <onboarding@resend.dev>';
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ContactPayload = {
  name?: string;
  email?: string;
  message?: string;
};

const sanitize = (value?: string) => (typeof value === 'string' ? value.trim() : '');

type DeliveryResult = {
  delivered: boolean;
  reason?: string;
};

async function persistMessage(entry: Record<string, string>) {
  try {
    await fs.mkdir(path.dirname(messagesPath), { recursive: true });
    let existing: Record<string, string>[] = [];
    try {
      const file = await fs.readFile(messagesPath, 'utf8');
      existing = JSON.parse(file);
      if (!Array.isArray(existing)) existing = [];
    } catch (err: any) {
      if (err?.code !== 'ENOENT') throw err;
    }

    existing.push(entry);
    if (existing.length > 250) existing = existing.slice(-250);
    await fs.writeFile(messagesPath, JSON.stringify(existing, null, 2));
    return true;
  } catch (err) {
    console.warn('[contact] Failed to persist message:', err);
    return false;
  }
}

async function sendViaResend(apiKey: string, payload: Record<string, any>) {
  return fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
}

function needsVerifiedDomainRetry(errorText: string) {
  return errorText.toLowerCase().includes('verified domain') || errorText.toLowerCase().includes('from address');
}

async function trySendEmail(entry: Record<string, string>): Promise<DeliveryResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL ?? defaultRecipient;
  if (!apiKey || !toEmail) {
    return { delivered: false, reason: 'not_configured' };
  }

  const preferredSender = process.env.CONTACT_FROM_EMAIL ?? defaultSender;
  const basePayload = {
    from: preferredSender,
    to: [toEmail],
    reply_to: entry.email || undefined,
    subject: `New portfolio inquiry from ${entry.name || 'visitor'}`,
    text: `${entry.message}\n\nFrom: ${entry.name || 'Anonymous'}${entry.email ? ` (${entry.email})` : ''}`
  };

  const response = await sendViaResend(apiKey, basePayload);
  if (response.ok) {
    return { delivered: true };
  }

  const errorText = await response.text();
  console.error('[contact] Resend error:', errorText);

  if (preferredSender !== defaultSender && needsVerifiedDomainRetry(errorText)) {
    const fallbackResponse = await sendViaResend(apiKey, { ...basePayload, from: defaultSender });
    if (fallbackResponse.ok) {
      return { delivered: true, reason: 'fallback_sender' };
    }
    const fallbackError = await fallbackResponse.text();
    console.error('[contact] Resend fallback error:', fallbackError);
  }

  return { delivered: false, reason: 'delivery_failed' };
}

export async function POST(request: Request) {
  let payload: ContactPayload;
  try {
    payload = await request.json();
  } catch (err) {
    return NextResponse.json({ success: false, message: 'Invalid request body.' }, { status: 400 });
  }

  const name = sanitize(payload.name);
  const email = sanitize(payload.email);
  const message = sanitize(payload.message);

  if (!message || message.length < 10) {
    return NextResponse.json({ success: false, message: 'Message must be at least 10 characters.' }, { status: 400 });
  }

  if (email && !emailRegex.test(email)) {
    return NextResponse.json({ success: false, message: 'Please provide a valid email address.' }, { status: 400 });
  }

  const entry = {
    name: name || 'Anonymous',
    email,
    message,
    createdAt: new Date().toISOString()
  };

  const [persisted, delivery] = await Promise.all([
    persistMessage(entry),
    trySendEmail(entry)
  ]);

  if (!persisted && !delivery.delivered) {
    return NextResponse.json(
      {
        success: false,
        message: 'Unable to deliver message. Email service is not configured and local storage is unavailable.'
      },
      { status: 503 }
    );
  }

  const responseMessage = delivery.delivered
    ? delivery.reason === 'fallback_sender'
      ? 'Your message was sent using the default Resend sender. Configure CONTACT_FROM_EMAIL with a verified domain to customize it.'
      : 'Your message was sent successfully.'
    : 'Message saved locally. Configure your Resend API key and verified sender to enable email delivery.';

  return NextResponse.json({
    success: true,
    delivered: delivery.delivered,
    persisted,
    message: responseMessage
  });
}
