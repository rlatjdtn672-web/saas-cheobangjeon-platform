import type { Metadata } from "next";
import { LAB_TASKS } from "@/data/lab";
import SiteHeader from "../components/SiteHeader";
import LabView from "../components/LabView";
import PageViewTracker from "../components/PageViewTracker";

export const metadata: Metadata = {
  title: "AI 모델 실험실 — 같은 미션, 다른 모델",
  description:
    "Claude Opus·Sonnet·Haiku부터 Qwen·Gemma·Llama·Mistral 같은 로컬 오픈모델까지, 동일한 프롬프트로 게임(테트리스·2048·스트리트 파이터·길건너 친구들)을 만들게 한 결과물과 직접 테스트 결과를 그대로 비교합니다.",
};

export default function LabPage() {
  return (
    <main className="relative">
      {/* 실험실 방문 = SaaS 4호(ai-lab) 유입으로 집계 */}
      <PageViewTracker type="saas_view" saasId="ai-lab" />
      <SiteHeader />
      <div className="glow pointer-events-none absolute inset-x-0 top-0 h-[320px]" />
      <LabView tasks={LAB_TASKS} />
    </main>
  );
}
