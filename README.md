# 실전 SaaS 처방전 — 리뷰 & 임팩트 플랫폼

뉴스레터 **"실전 SaaS 처방전"** 이 리뷰한 인디 SaaS들을 한눈에 보여주고,
그 리뷰가 **얼마나 실제 유입(트래픽)을 만들었는지** 측정하는 플랫폼입니다.

## 🟢 현재 라이브 (영구 배포 완료)

- **사이트:** https://rlatjdtn672-web.github.io/saas-cheobangjeon-platform/  (GitHub Pages, 무료)
- **DB / 지표:** Supabase 프로젝트 `saas-cheobangjeon` (ref `oaglzmiidhjrumfnltrx`, region ap-southeast-1)
- **방식:** `docs/index.html` 정적 대시보드 → 브라우저가 Supabase anon 키로 직접 데이터 조회 + 트래픽 이벤트 기록. 빌드/서버 불필요.
- 새 리뷰 추가: Supabase **Table Editor → `saas` 테이블**에 행 추가하면 즉시 사이트에 반영됨.

### 📌 LinkedIn 댓글에 붙일 링크 (출처 자동 추적)

글을 LinkedIn에 발행한 뒤, **댓글에 아래 형식의 링크**를 달면 거기서 넘어온 유입이 `linkedin` 출처로 집계됩니다:

```
https://rlatjdtn672-web.github.io/saas-cheobangjeon-platform/s.html?slug=<SLUG>&ref=linkedin
```

- TradingAgents → `.../s.html?slug=tradingagents&ref=linkedin`
- n8n → `.../s.html?slug=n8n&ref=linkedin`

`?ref=linkedin`을 붙이는 이유: LinkedIn은 외부 클릭 시 referrer를 가리는 경우가 많아, 파라미터로 출처를 명시하면 정확히 잡힙니다.

### 기능 요약 (대시보드에서 보이는 것)

- **플랫폼 총 유입 / LinkedIn 유입** — 상세·대시보드 방문 수, 출처별 분리
- **일자별 유입 시계열 차트** — 전체 vs LinkedIn (최근 14일)
- **유입 → GitHub 전환 퍼널** — 플랫폼 방문 중 몇 %가 GitHub로 넘어갔는지
- **GitHub 스타 추이** — 매일 자동 스냅샷(Supabase pg_cron), 스타 증감 그래프
- **SaaS 상세 허브 페이지**(`s.html?slug=`) — 설명·GitHub·관련 링크 모음

### (선택) 업그레이드 — Vercel 동적 버전
이 저장소의 Next.js 앱(`app/`)은 서버사이드 트래킹(지표 위변조 방지)이 가능한 동적 버전입니다.
Vercel 계정 온보딩(vercel.com 최초 로그인)을 완료하면 `.env.local`의 키로 즉시 배포 가능합니다.
현재는 신규 계정이 `limited` 상태라 토큰만으로는 프로젝트 생성이 막혀 있습니다.

---

- 🧾 리뷰한 SaaS 카드 (설명 · 가격 · 카테고리 · 공식 사이트 · 원문 리뷰 링크)
- 📊 임팩트 대시보드 (SaaS로 보낸 유입 클릭 · 리뷰 클릭 · 페이지뷰 · TOP SaaS)
- 🔗 모든 아웃바운드 링크는 추적 리다이렉트(`/go`)를 거쳐 클릭이 집계됨
- 🎯 최종 비전: 인디 SaaS → 대형 SaaS 광고 플랫폼

## 기술 스택

| 영역 | 선택 | 비용 |
|------|------|------|
| 프레임워크 | Next.js 14 (App Router) | 무료 |
| 호스팅 | **Vercel** (Hobby) | 무료 |
| DB / 지표 저장 | **Supabase** (Postgres) | 무료 |

> Supabase 키가 없으면 로컬에서는 **메모리 모드**로 동작합니다(재시작 시 지표 초기화).
> 배포 시에만 키를 넣으면 지표가 영구 저장됩니다.

---

## 1. 로컬에서 바로 보기 (키 불필요)

```bash
npm install
npm run dev
# http://localhost:3000
```

## 2. 무료 배포 (Vercel + Supabase)

### A. Supabase 세팅 (DB)
1. https://supabase.com 가입 → **New project** 생성 (무료)
2. 좌측 **SQL Editor** → `supabase/schema.sql` 내용 전체 붙여넣고 **RUN**
   (테이블 + 시드 데이터 생성됨)
3. **Settings → API** 에서 아래 3개 값 복사:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role secret` → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ 비공개)

### B. Vercel 배포 (호스팅)
1. 이 폴더를 GitHub 저장소로 push
2. https://vercel.com 가입 → **Add New → Project** → 저장소 import
3. **Environment Variables** 에 위 3개 + `NEXT_PUBLIC_SITE_URL`(배포 도메인) 입력
4. **Deploy** → 끝. 푸시할 때마다 자동 재배포됩니다.

> CLI로 배포하려면: `npm i -g vercel && vercel` (이후 `vercel --prod`)

---

## 3. 새 SaaS 리뷰 추가하는 법

뉴스레터에서 새 SaaS를 다룰 때마다 둘 중 하나로 추가:

- **(권장) Supabase**: Table Editor → `saas` 테이블에 행 추가
- **코드**: `data/seed.ts` 의 `SEED_SAAS` 배열에 객체 추가 후 재배포

필드: `id, slug, name, tagline, description, category, pricing, website_url,
logo_url, review_title, review_url, published_at, issue_no, featured`

---

## 트래픽이 집계되는 방식

| 이벤트 | 발생 시점 |
|--------|-----------|
| `page_view` | 방문자가 대시보드를 열 때 |
| `website_click` | "사이트 방문" 클릭 → SaaS로 유입 (**핵심 임팩트 지표**) |
| `review_click` | "리뷰 읽기" 클릭 → 원문 리뷰로 이동 |

모든 클릭은 `/go?type=...&id=...` 리다이렉트를 거치므로 JS가 꺼져 있어도 집계됩니다.
이벤트 기록은 서버 전용 `service_role` 키로만 가능해 **지표 위변조가 불가능**합니다.

## 디렉터리

```
app/
  page.tsx              대시보드 (임팩트 + SaaS 그리드 + 타임라인)
  go/route.ts           클릭 추적 리다이렉트
  api/track/route.ts    page_view 등 이벤트 기록 API
  components/           SaasCard, PageViewTracker
lib/
  store.ts              Supabase ↔ 메모리 추상화 (자동 선택)
  types.ts              도메인 타입
data/seed.ts            뉴스레터 기반 시드 데이터
supabase/schema.sql     Supabase 테이블 + 시드 SQL
```
