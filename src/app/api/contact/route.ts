// Contact form API route — Resend email delivery + in-memory rate limit
// Requires: npm install resend
// Env vars: RESEND_API_KEY, FROM_EMAIL (e.g. contact@yourdomain.com), TO_EMAIL (client inbox)
// See knowledge/cms-path.md for environment variable setup guidance.
//
// Rate limiting: the in-memory limiter below protects a single-instance deploy (the default
// for Cloudflare Pages functions during one execution window). It is not shared across cold
// starts or regional instances. For multi-instance / high-traffic deploys, swap for
// @upstash/ratelimit + @upstash/redis — drop-in, same semantics, globally consistent:
//   npm install @upstash/ratelimit @upstash/redis
// See https://upstash.com/docs/ratelimit/overview for the replacement pattern.

import { Resend } from 'resend';
import { NextRequest } from 'next/server';

// Lazy singleton — deferred until first request so build-time env absence does not throw
let _resend: Resend | null = null;
function getResend(): Resend {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY);
  return _resend;
}

// ── Rate limiter ──────────────────────────────────────────────────────────────
// Sliding window: each IP may submit RATE_LIMIT times within RATE_WINDOW_MS.
// Opportunistic cleanup prevents unbounded growth under sparse traffic.

const RATE_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const RATE_LIMIT = 3;
const rateStore = new Map<string, number[]>();

function getClientIp(request: NextRequest): string {
  // Cloudflare injects CF-Connecting-IP; most reverse proxies populate X-Forwarded-For.
  // Fall back to request.ip (edge runtime) or a shared sentinel so at least bucketed rate
  // limiting applies when no identifying header is present.
  const cf = request.headers.get('cf-connecting-ip');
  if (cf) return cf.trim();
  const xff = request.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();
  const edgeIp = (request as unknown as { ip?: string }).ip;
  return edgeIp ?? 'unknown';
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entries = (rateStore.get(ip) ?? []).filter(t => now - t < RATE_WINDOW_MS);
  if (entries.length >= RATE_LIMIT) {
    rateStore.set(ip, entries);
    return true;
  }
  entries.push(now);
  rateStore.set(ip, entries);
  if (rateStore.size > 5000) {
    // Garbage-collect fully expired entries so the map does not leak under sparse traffic.
    for (const [k, v] of rateStore) {
      if (v.every(t => now - t >= RATE_WINDOW_MS)) rateStore.delete(k);
    }
  }
  return false;
}

// ── Payload validation ────────────────────────────────────────────────────────

interface ContactPayload {
  name: string;
  email: string;
  service: string;
  message: string;
}

function isValidPayload(body: unknown): body is ContactPayload {
  if (typeof body !== 'object' || body === null) return false;
  const b = body as Record<string, unknown>;
  return (
    typeof b.name === 'string' && b.name.trim().length > 0 && b.name.length <= 200 &&
    typeof b.email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b.email) &&
    typeof b.service === 'string' && b.service.trim().length > 0 && b.service.length <= 200 &&
    typeof b.message === 'string' && b.message.trim().length > 0 && b.message.length <= 5000
  );
}

// ── Route handler ─────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  // Check rate limit before reading the body — abusive clients get cheap 429s.
  const ip = getClientIp(request);
  if (isRateLimited(ip)) {
    return Response.json(
      { error: 'Too many requests. Try again in 10 minutes.' },
      { status: 429, headers: { 'Retry-After': '600' } },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (!isValidPayload(body)) {
    return Response.json(
      { error: 'Missing or invalid fields: name, email, service, message' },
      { status: 400 },
    );
  }

  const { name, email, service, message } = body;
  const fromEmail = process.env.FROM_EMAIL ?? 'onboarding@resend.dev';
  const toEmail = process.env.TO_EMAIL;

  if (!toEmail) {
    console.error('[contact] TO_EMAIL env var not set');
    return Response.json({ error: 'Server configuration error' }, { status: 500 });
  }

  try {
    const { error } = await getResend().emails.send({
      from: fromEmail,
      to: toEmail,
      replyTo: email,
      subject: `New enquiry — ${name}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        `Service interest: ${service}`,
        `Message:\n${message}`,
      ].join('\n\n'),
    });

    if (error) {
      console.error('[contact] Resend error:', error);
      return Response.json({ error: 'Failed to send message' }, { status: 500 });
    }
  } catch (err) {
    console.error('[contact] Resend threw:', err);
    return Response.json({ error: 'Failed to send message' }, { status: 500 });
  }

  return Response.json({ success: true });
}
