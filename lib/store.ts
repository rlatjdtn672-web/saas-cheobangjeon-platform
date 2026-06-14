import "server-only";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { SEED_SAAS } from "@/data/seed";
import type {
  Saas,
  EventType,
  TrackEvent,
  SaasStats,
  ImpactSummary,
} from "@/lib/types";

// ───────────────────────────────────────────────────────────────
//  데이터 스토어 추상화
//  - Supabase 키가 있으면 → Postgres에 영구 저장 (배포 모드)
//  - 키가 없으면 → 메모리 모드 (로컬 미리보기, 재시작 시 이벤트 초기화)
// ───────────────────────────────────────────────────────────────

export interface Store {
  mode: "supabase" | "memory";
  listSaas(): Promise<Saas[]>;
  getSaas(idOrSlug: string): Promise<Saas | null>;
  recordEvent(type: EventType, saasId?: string | null, referrer?: string | null): Promise<void>;
  statsBySaas(): Promise<Record<string, SaasStats>>;
  impact(): Promise<ImpactSummary>;
}

// ── 메모리 구현 ───────────────────────────────────────────────
const memEvents: TrackEvent[] = [];

class MemoryStore implements Store {
  mode = "memory" as const;

  async listSaas(): Promise<Saas[]> {
    return [...SEED_SAAS].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  }

  async getSaas(idOrSlug: string): Promise<Saas | null> {
    return SEED_SAAS.find((s) => s.id === idOrSlug || s.slug === idOrSlug) ?? null;
  }

  async recordEvent(type: EventType, saasId?: string | null, referrer?: string | null) {
    memEvents.push({
      type,
      saasId: saasId ?? null,
      referrer: referrer ?? null,
      createdAt: new Date().toISOString(),
    });
  }

  async statsBySaas(): Promise<Record<string, SaasStats>> {
    const out: Record<string, SaasStats> = {};
    for (const s of SEED_SAAS) {
      out[s.id] = { saasId: s.id, websiteClicks: 0, reviewClicks: 0, views: 0 };
    }
    for (const e of memEvents) {
      if (!e.saasId || !out[e.saasId]) continue;
      if (e.type === "website_click") out[e.saasId].websiteClicks++;
      else if (e.type === "review_click") out[e.saasId].reviewClicks++;
      else if (e.type === "saas_view") out[e.saasId].views++;
    }
    return out;
  }

  async impact(): Promise<ImpactSummary> {
    return buildImpact(SEED_SAAS, memEvents);
  }
}

// ── Supabase 구현 ─────────────────────────────────────────────
class SupabaseStore implements Store {
  mode = "supabase" as const;
  private db: SupabaseClient;

  constructor(url: string, serviceKey: string) {
    this.db = createClient(url, serviceKey, {
      auth: { persistSession: false },
    });
  }

  async listSaas(): Promise<Saas[]> {
    const { data, error } = await this.db
      .from("saas")
      .select("*")
      .order("published_at", { ascending: false });
    if (error || !data) {
      // 테이블이 아직 비어있거나 미생성이면 시드로 폴백
      return [...SEED_SAAS].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
    }
    return data.map(rowToSaas);
  }

  async getSaas(idOrSlug: string): Promise<Saas | null> {
    const { data } = await this.db
      .from("saas")
      .select("*")
      .or(`id.eq.${idOrSlug},slug.eq.${idOrSlug}`)
      .limit(1)
      .maybeSingle();
    if (data) return rowToSaas(data);
    return SEED_SAAS.find((s) => s.id === idOrSlug || s.slug === idOrSlug) ?? null;
  }

  async recordEvent(type: EventType, saasId?: string | null, referrer?: string | null) {
    await this.db.from("events").insert({
      type,
      saas_id: saasId ?? null,
      referrer: referrer ?? null,
    });
  }

  async statsBySaas(): Promise<Record<string, SaasStats>> {
    const saasList = await this.listSaas();
    const out: Record<string, SaasStats> = {};
    for (const s of saasList) {
      out[s.id] = { saasId: s.id, websiteClicks: 0, reviewClicks: 0, views: 0 };
    }
    const { data } = await this.db.from("events").select("type, saas_id");
    for (const e of data ?? []) {
      const id = (e as any).saas_id as string | null;
      if (!id || !out[id]) continue;
      const t = (e as any).type as EventType;
      if (t === "website_click") out[id].websiteClicks++;
      else if (t === "review_click") out[id].reviewClicks++;
      else if (t === "saas_view") out[id].views++;
    }
    return out;
  }

  async impact(): Promise<ImpactSummary> {
    const saasList = await this.listSaas();
    const { data } = await this.db.from("events").select("type, saas_id, created_at");
    const events: TrackEvent[] = (data ?? []).map((e: any) => ({
      type: e.type,
      saasId: e.saas_id,
      referrer: null,
      createdAt: e.created_at,
    }));
    return buildImpact(saasList, events);
  }
}

// ── 공용 집계 함수 ─────────────────────────────────────────────
function buildImpact(saasList: Saas[], events: TrackEvent[]): ImpactSummary {
  let totalWebsiteClicks = 0;
  let totalReviewClicks = 0;
  let totalPageViews = 0;
  const perSaas: Record<string, number> = {};

  for (const e of events) {
    if (e.type === "page_view") totalPageViews++;
    else if (e.type === "website_click") {
      totalWebsiteClicks++;
      if (e.saasId) perSaas[e.saasId] = (perSaas[e.saasId] ?? 0) + 1;
    } else if (e.type === "review_click") {
      totalReviewClicks++;
    }
  }

  const topSaas = saasList
    .map((saas) => ({ saas, clicks: perSaas[saas.id] ?? 0 }))
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 5);

  return {
    totalReviews: saasList.length,
    totalWebsiteClicks,
    totalReviewClicks,
    totalPageViews,
    topSaas,
  };
}

function rowToSaas(r: any): Saas {
  let links: any[] = [];
  try {
    links = Array.isArray(r.links) ? r.links : JSON.parse(r.links ?? "[]");
  } catch {
    links = [];
  }
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    tagline: r.tagline ?? "",
    description: r.description ?? "",
    body: r.body ?? undefined,
    category: r.category ?? "",
    pricing: r.pricing ?? "",
    websiteUrl: r.website_url ?? "",
    githubUrl: r.github_url ?? undefined,
    githubRepo: r.github_repo ?? undefined,
    logoUrl: r.logo_url ?? undefined,
    links,
    reviewTitle: r.review_title ?? "",
    reviewUrl: r.review_url ?? "",
    publishedAt: (r.published_at ?? "").slice(0, 10),
    issueNo: r.issue_no ?? undefined,
    featured: r.featured ?? false,
  };
}

// ── 싱글톤 선택 ───────────────────────────────────────────────
let _store: Store | null = null;

export function getStore(): Store {
  if (_store) return _store;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (url && key) {
    _store = new SupabaseStore(url, key);
  } else {
    _store = new MemoryStore();
  }
  return _store;
}
