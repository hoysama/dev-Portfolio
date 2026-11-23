export interface Env {
  ASSETS: Fetcher;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // Security headers helper
    const addSecurityHeaders = (res: Response): Response => {
      const headers = new Headers(res.headers);
      headers.set('X-Content-Type-Options', 'nosniff');
      headers.set('X-Frame-Options', 'DENY');
      headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
      headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
      return new Response(res.body, {
        status: res.status,
        statusText: res.statusText,
        headers,
      });
    };

    // API: Live Edge ping & colo detection
    if (url.pathname === '/api/health') {
      const cf = (request as any).cf || {};
      const payload = {
        status: 'healthy',
        architect: 'Abdullah Ajaj',
        role: 'Full-Stack Architect',
        edge_datacenter: cf.colo || 'GLOBAL',
        city: cf.city || 'Edge Node',
        country: cf.country || 'Global',
        asn: cf.asn || 'Cloudflare Anycast',
        httpProtocol: cf.httpProtocol || 'HTTP/3 (QUIC)',
        timestamp: new Date().toISOString(),
      };

      return new Response(JSON.stringify(payload, null, 2), {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    // API: Contact Form handling
    if (url.pathname === '/api/contact' && request.method === 'POST') {
      try {
        const body = (await request.json()) as { name?: string; email?: string; message?: string };
        const { name, email, message } = body;

        if (!name || !email || !message) {
          return new Response(
            JSON.stringify({ success: false, error: 'All fields are required.' }),
            {
              status: 400,
              headers: { 'Content-Type': 'application/json' },
            }
          );
        }

        // Email / Name length validations
        if (name.length > 100 || email.length > 100 || message.length > 2000) {
          return new Response(
            JSON.stringify({ success: false, error: 'Input exceeds maximum allowed length.' }),
            {
              status: 400,
              headers: { 'Content-Type': 'application/json' },
            }
          );
        }

        // Log received message in Worker logs
        console.log(`[Contact Form Received] From: ${name} <${email}>: ${message.slice(0, 100)}...`);

        return new Response(
          JSON.stringify({
            success: true,
            message: 'Your message has been received! Abdullah will get back to you shortly.',
          }),
          {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      } catch (err: any) {
        return new Response(
          JSON.stringify({ success: false, error: 'Invalid JSON request payload.' }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }
    }

    // Serve static assets through Workers Asset binding
    try {
      const assetResponse = await env.ASSETS.fetch(request);
      return addSecurityHeaders(assetResponse);
    } catch (e: any) {
      return new Response('Edge Asset Fetch Error', { status: 500 });
    }
  },
};
