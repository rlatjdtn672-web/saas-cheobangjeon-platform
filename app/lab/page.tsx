import type { Metadata } from "next";
import { LAB_TASKS } from "@/data/lab";
import SiteHeader from "../components/SiteHeader";
import LabView from "../components/LabView";

export const metadata: Metadata = {
  title: "AI 모델 실험실 — 같은 미션, 다른 모델",
  description:
    "Claude Opus·Sonnet·Haiku부터 Qwen·Gemma·Llama·Mistral 같은 로컬 오픈모델까지, 동일한 프롬프트로 게임(테트리스·2048·스트리트 파이터·크로시 로드)을 만들게 한 결과물과 점수를 그대로 비교합니다.",
};

export default function LabPage() {
  return (
    <main className="relative">
      <SiteHeader />
      <div className="glow pointer-events-none absolute inset-x-0 top-0 h-[320px]" />
      <LabView tasks={LAB_TASKS} />
    </main>
  );
}
