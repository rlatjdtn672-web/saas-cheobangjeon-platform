// 블로그 탭(섹션) 정의 — 새 탭을 늘리려면 여기에 추가
export type SectionKey = "main" | "lia";

export type Section = {
  key: SectionKey;
  title: string;
  path: string; // 목록 경로
  desc: string;
};

export const SECTIONS: Record<SectionKey, Section> = {
  main: { key: "main", title: "블로그", path: "/blog", desc: "SaaS · AI · 자동화 이야기" },
  lia: { key: "lia", title: "리아영어", path: "/english", desc: "영어 학습 기록 · 리아영어" },
};

export const SECTION_LIST: Section[] = [SECTIONS.main, SECTIONS.lia];

// 상단 탭(홈 + 각 섹션)
export const TABS = [{ key: "home", title: "홈", path: "/" }, ...SECTION_LIST];
