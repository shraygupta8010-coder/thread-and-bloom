import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

// In-Memory store for Edge/Node middleware
const ipRequestMap = new Map<string, RateLimitRecord>();

// Clean up stale entries every 5 minutes to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of ipRequestMap.entries()) {
    if (now > record.resetAt) {
      ipRequestMap.delete(ip);
    }
  }
}, 5 * 60 * 1000);

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Skip static assets, internal Next.js assets, and image files
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  // 2. Identify client IP
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const clientIp = forwardedFor ? forwardedFor.split(',')[0].trim() : realIp || '127.0.0.1';

  // 3. Define route-specific rate limits
  const isSensitiveRoute = pathname.startsWith('/checkout') || pathname.startsWith('/admin');
  const windowMs = 60 * 1000; // 1 minute sliding window
  const maxRequests = isSensitiveRoute ? 40 : 120; // 40 req/min for checkout/admin, 120 req/min for catalog

  const now = Date.now();
  const key = `${clientIp}:${isSensitiveRoute ? 'sensitive' : 'general'}`;
  let record = ipRequestMap.get(key);

  if (!record || now > record.resetAt) {
    record = {
      count: 1,
      resetAt: now + windowMs,
    };
    ipRequestMap.set(key, record);
  } else {
    record.count += 1;
  }

  const remaining = Math.max(0, maxRequests - record.count);
  const resetSeconds = Math.ceil((record.resetAt - now) / 1000);

  // 4. If limit exceeded, return 429 Too Many Requests
  if (record.count > maxRequests) {
    const isHtmlRequest = request.headers.get('accept')?.includes('text/html');

    if (isHtmlRequest) {
      const htmlResponse = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Rate Limit Exceeded — Thread &amp; Bloom</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #12100E;
      color: #E6C594;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      text-align: center;
    }
    .box {
      max-width: 480px;
      padding: 40px 24px;
      border: 1px solid rgba(230, 197, 148, 0.3);
      background: rgba(30, 26, 23, 0.8);
    }
    h1 {
      font-size: 24px;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      margin-bottom: 12px;
    }
    p {
      font-size: 14px;
      line-height: 1.6;
      color: rgba(255, 255, 255, 0.7);
      margin-bottom: 24px;
    }
    .countdown {
      font-family: monospace;
      font-weight: bold;
      color: #E6C594;
    }
  </style>
  <script>
    let seconds = ${resetSeconds};
    setInterval(function() {
      seconds--;
      if (seconds <= 0) {
        window.location.reload();
      } else {
        const el = document.getElementById('cd');
        if (el) el.innerText = seconds + ' seconds';
      }
    }, 1000);
  </script>
</head>
<body>
  <div class="box">
    <h1>Thread &amp; Bloom Atelier</h1>
    <p>We detected an unusually high volume of requests from your connection. To protect our concierge network, access has been momentarily paused.</p>
    <p>Service will automatically resume in <span id="cd" class="countdown">${resetSeconds} seconds</span>.</p>
  </div>
</body>
</html>`;

      return new NextResponse(htmlResponse, {
        status: 429,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Retry-After': String(resetSeconds),
          'RateLimit-Limit': String(maxRequests),
          'RateLimit-Remaining': '0',
          'RateLimit-Reset': String(resetSeconds),
        },
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many requests. Please wait a moment before trying again.',
        retryAfterSeconds: resetSeconds,
      },
      {
        status: 429,
        headers: {
          'Retry-After': String(resetSeconds),
          'RateLimit-Limit': String(maxRequests),
          'RateLimit-Remaining': '0',
          'RateLimit-Reset': String(resetSeconds),
        },
      }
    );
  }

  // 5. Normal response with rate limit telemetry headers
  const response = NextResponse.next();
  response.headers.set('RateLimit-Limit', String(maxRequests));
  response.headers.set('RateLimit-Remaining', String(remaining));
  response.headers.set('RateLimit-Reset', String(resetSeconds));

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files with extensions (.svg, .png, .jpg, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
