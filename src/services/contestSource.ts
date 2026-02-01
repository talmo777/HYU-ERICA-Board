// src/services/contestSource.ts
import { Contest, Category } from "../../types";
import { mockContests } from "../../data/mockContests";

const STORAGE_KEY_CONTESTS = "erica_contests_v1";

type AdminStoredContest = {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  applyUrl?: string;
  category?: string;
  status?: string;
  targets?: string[];
  startDate?: string; // ISO
  endDate?: string;   // ISO
  createdAt?: string;
  updatedAt?: string;
  viewCount?: number;
};

function toDateOnly(input?: string): string | undefined {
  if (!input) return undefined;
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return undefined;
  return d.toISOString().split("T")[0];
}

function coerceCategory(input?: string): Category {
  if (input === "서포터즈") return "서포터즈";
  if (input === "IC-PBL") return "IC-PBL";
  if (input === "교내 공모전") return "교내 공모전";
  if (input === "대외활동") return "대외활동";
  return "교내 공모전";
}

function mapAdminToPublic(c: AdminStoredContest): Contest {
  const deadline =
    toDateOnly(c.endDate) ??
    toDateOnly(c.startDate) ??
    toDateOnly(new Date().toISOString())!;

  const start = toDateOnly(c.startDate);

  const targets = Array.isArray(c.targets) ? c.targets : [];
  const targetText = targets.length ? targets.join(", ") : "전체";

  const apply = c.applyUrl ?? "";
  const source = apply; // 2단계에서 source_url(원문 링크) 분리 예정

  return {
    id: String(c.id),
    title: c.title ?? "(제목 없음)",
    organizer: targets[0] ?? "한양대 ERICA", // 임시: 첫 타겟을 주관으로 간주
    category: coerceCategory(c.category),
    start_date: start,
    end_date: deadline,
    deadline,
    tags: targets.slice(0, 5), // 임시: 타겟을 태그로도 노출(추후 분리 가능)
    target: targetText,
    summary: c.description ?? "",
    source_url: source,
    apply_url: apply,
    imageUrl: c.imageUrl,
  };
}

export async function fetchContestsForUserWeb(): Promise<Contest[]> {
  // 빌드/SSR 안전 가드
  if (typeof window === "undefined") return mockContests;

  const raw = window.localStorage.getItem(STORAGE_KEY_CONTESTS);
  if (!raw) return mockContests;

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return mockContests;

    const mapped = parsed.map(mapAdminToPublic);
    return mapped.length ? mapped : mockContests;
  } catch {
    return mockContests;
  }
}
