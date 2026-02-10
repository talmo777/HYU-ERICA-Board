// src/utils/date.ts

export function parseYmd(s?: string): Date | null {
  if (!s) return null;
  const d = new Date(`${s}T00:00:00`);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function startOfToday(): Date {
  const t = new Date();
  return new Date(t.getFullYear(), t.getMonth(), t.getDate());
}

export function ymd(d: Date): string {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * deadline(YYYY-MM-DD) 기준 오늘(로컬 00:00)과의 차이를 "일(day)"로 반환
 *  - D-7이면 7
 *  - D-day이면 0
 *  - 마감 이후는 음수
 */
export function daysLeftTo(deadlineYmd?: string, baseDate: Date = startOfToday()): number | null {
  const end = parseYmd(deadlineYmd);
  if (!end) return null;

  const base = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate());
  const ms = 24 * 60 * 60 * 1000;
  return Math.floor((end.getTime() - base.getTime()) / ms);
}
