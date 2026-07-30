/* Rate limiting sencillo en memoria (por instancia serverless).
   Suficiente como primera barrera junto con el honeypot. */
const hits = new Map<string, { n: number; t: number }>();

export function rateLimit(ip: string, limit = 20, windowMs = 60_000): boolean {
  const now = Date.now();
  const h = hits.get(ip);
  if (!h || now - h.t > windowMs) { hits.set(ip, { n: 1, t: now }); return true; }
  h.n += 1;
  if (hits.size > 5000) hits.clear(); // evitar crecimiento sin límite
  return h.n <= limit;
}

export function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for") || "";
  return fwd.split(",")[0].trim() || "unknown";
}
