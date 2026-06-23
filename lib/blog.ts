import "server-only";

const URL_BASE =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://oaglzmiidhjrumfnltrx.supabase.co";
const ANON =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9hZ2x6bWlpZGhqcnVtZm5sdHJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE0MDYzNTcsImV4cCI6MjA5Njk4MjM1N30.y3K5Ky14shiAwXkGvHkJpq5QHg0G4x7RjSdM8QJE5M4";

export type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  body: string | null;
  cover_url: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
};

const H = { apikey: ANON, Authorization: "Bearer " + ANON };

async function rest(path: string) {
  try {
    const r = await fetch(`${URL_BASE}/rest/v1/${path}`, { headers: H, cache: "no-store" });
    return r.ok ? await r.json() : [];
  } catch {
    return [];
  }
}
async function rpc(fn: string, body: any) {
  try {
    const r = await fetch(`${URL_BASE}/rest/v1/rpc/${fn}`, {
      method: "POST",
      headers: { ...H, "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });
    if (!r.ok) return null;
    return r.json().catch(() => null);
  } catch {
    return null;
  }
}

// 공개: 발행된 글만
export async function listPublishedPosts(): Promise<Post[]> {
  return rest(
    "posts?select=id,slug,title,excerpt,cover_url,published,created_at,updated_at&published=eq.true&order=created_at.desc"
  );
}
export async function getPublishedPost(slug: string): Promise<Post | null> {
  const rows = await rest(
    `posts?select=*&slug=eq.${encodeURIComponent(slug)}&published=eq.true&limit=1`
  );
  return Array.isArray(rows) && rows[0] ? rows[0] : null;
}

// 관리(비번)
export async function postsAdmin(pw: string): Promise<Post[]> {
  const d = await rpc("posts_admin", { pw });
  return Array.isArray(d) ? d : [];
}
export async function upsertPost(
  pw: string,
  p: {
    id?: string;
    slug?: string;
    title: string;
    excerpt?: string;
    body?: string;
    cover?: string;
    published?: boolean;
  }
) {
  return rpc("upsert_post", {
    pw,
    p_id: p.id ?? "",
    p_slug: p.slug ?? "",
    p_title: p.title,
    p_excerpt: p.excerpt ?? "",
    p_body: p.body ?? "",
    p_cover: p.cover ?? "",
    p_published: p.published ?? false,
  });
}
export async function deletePost(pw: string, id: string) {
  return rpc("delete_post", { pw, p_id: id });
}
