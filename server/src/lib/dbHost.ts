// Decides whether a Postgres connection string points at a local database.
//
// Local hosts skip SSL: docker-compose service names (single-label like `postgres`),
// localhost, and loopback addresses. Anything with a dotted hostname (Supabase's
// `*.pooler.supabase.com`) is treated as a managed/remote DB and gets SSL. The SSL
// gate was previously `NODE_ENV === 'production'`, which broke the merged prod stack
// (docker-compose.prod.yml sets NODE_ENV=production but its Postgres has no SSL).
export function dbHostIsLocal(connectionString: string): boolean {
  let host: string;
  try {
    host = new URL(connectionString).hostname;
  } catch {
    return false; // unparseable -> assume remote, request SSL (conservative)
  }
  // URL.hostname keeps IPv6 brackets, e.g. "[::1]"
  if (host.startsWith('[') && host.endsWith(']')) host = host.slice(1, -1);
  if (host === 'localhost' || host === '127.0.0.1' || host === '::1' || host === '') return true;
  // Docker-compose service names and bare LAN hostnames are single-label (no dots);
  // managed DBs like Supabase's *.pooler.supabase.com have dots -> remote.
  return !host.includes('.') && !host.includes(':');
}