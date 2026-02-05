// src/services/contestSource.ts
import { Contest, Category } from "../../types";
import { mockContests } from "../../data/mockContests";

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
  // API/DB 값이 'IC-PBL' 또는 'ICPBL' 둘 다 올 수 있어서 둘 다 허용
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

function mapApiToPublic(c: ApiContest): Contest {
  const end = toDateOnly(c.end_date);
  const start = toDateOnly(c.start_date);

  const targets = Array.isArray(c.targets) ? c.targets : [];
  const targetText = targets.length ? targets.join(", ") : "전체";

  const apply = c.apply_url ?? "";
  const source = c.source_url ?? apply;

  return {
    id: String(c.id),
    title: c.title ?? "(제목 없음)",
    organizer: "한양대 ERICA",
    category: coerceCategory(c.category),
    start_date: start,
    end_date: end,
    deadline: end ?? toDateOnly(new Date().toISOString())!,
    tags: targets.slice(0, 5),
    target: targetText,
    summary: c.description ?? "",
    source_url: source,
    apply_url: apply,
    imageUrl: c.poster_url ?? undefined,
  };
}

export async function fetchContestsForUserWeb(): Promise<Contest[]> {
  const API_BASE = (import.meta.env.VITE_BOARD_API_BASE_URL as string | undefined)?.replace(/\/+$/, "");

  // 빌드/SSR 안전 가드
  if (typeof window === "undefined") return mockContests;

  if (!API_BASE) {
    // env 없으면 기존처럼 mock
    return mockContests;
  }

  const url = `${API_BASE}/api/v1/contests?status=published`;
  const res = await fetch(url);

  if (!res.ok) {
    // API 터지면 mock fallback
    return mockContests;
  }

  const data = (await res.json()) as { items: ApiContest[] };
  const items = Array.isArray(data.items) ? data.items : [];

  const mapped = items.map(mapApiToPublic);
  return mapped.length ? mapped : mockContests;
}
