// src/services/contestSource.ts
import { Contest, Category } from "../../types";

type ApiContest = {
  id: string;
  title: string;
  description: string | null;
  poster_url: string | null;
  apply_url: string;
  source_url: string | null;
  category: string;
  targets: string[] | null;
  start_date: string | null;
  end_date: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

function coerceCategory(input?: string): Category {
  if (input === "서포터즈") return "서포터즈";
  if (input === "IC-PBL" || input === "ICPBL") return "IC-PBL";
  if (input === "대외활동") return "대외활동";
  return "교내 공모전";
}

function toDateOnly(input?: string | null): string | undefined {
  if (!input) return undefined;
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return undefined;
  return d.toISOString().split("T")[0];
}

function cleanSummary(raw: string): string {
  return raw
    // 맨 앞에 붙는 [AI 요약] 제거 (줄바꿈 포함)
    .replace(/^\s*\[AI\s*요약\]\s*\n?/u, "")
    // 혹시 중간에 남는 케이스 대비 (선택)
    .replace(/\n?\[AI\s*요약\]\n?/gu, "\n")
    .trim();
}

function mapApiToPublic(c: ApiContest): Contest {
  const end = toDateOnly(c.end_date);
  const start = toDateOnly(c.start_date);

  const targets = Array.isArray(c.targets) ? c.targets : [];
  const targetText = targets.length ? targets.join(", ") : "전체";

  const apply = c.apply_url ?? "";
  const source = c.source_url ?? apply;

  // deadline은 types.ts에서 필수라서 end가 없으면 오늘로 채움(안정성)
  const today = new Date().toISOString().split("T")[0];

  return {
    id: String(c.id),
    title: c.title ?? "(제목 없음)",
    organizer: "한양대 ERICA",
    category: coerceCategory(c.category),
    start_date: start,
    end_date: end,
    deadline: end ?? today,
    tags: targets.slice(0, 5),
    target: targetText,
    summary: c.description ?? "",
    source_url: source,
    apply_url: apply,
    imageUrl: c.poster_url ?? undefined,
  };
}

export async function fetchContestsForUserWeb(): Promise<Contest[]> {
  // ✅ 너가 통일하겠다고 한 env 키로 변경
  const API_BASE_RAW = import.meta.env.VITE_BOARD_API_BASE_URL as string | undefined;
  const API_BASE = API_BASE_RAW?.replace(/\/+$/, "");

  if (!API_BASE) return [];

  const url = `${API_BASE}/api/v1/contests?status=published`;

  try {
    const res = await fetch(url);
    if (!res.ok) return [];

    const data = (await res.json()) as { items: ApiContest[] };
    const items = Array.isArray(data.items) ? data.items : [];
    return items.map(mapApiToPublic);
  } catch {
    return [];
  }
}
