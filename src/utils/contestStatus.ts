// src/utils/contestStatus.ts

import type { Contest } from '../../types';
import { daysLeftTo, parseYmd } from './date';

export type ContestStatus = 'ONGOING' | 'URGENT' | 'CLOSED_RECENT' | 'HIDDEN';

export const RULES = {
  urgentMaxDays: 7,        // D-7 기준
  closedVisibleDays: 7,    // 마감 후 7일까지 노출
  ongoingMinDays: 8,       // D-8 이상이면 "진행중"
} as const;

export function getContestStatus(contest: Contest, now: Date = new Date()): ContestStatus {
  const dl = daysLeftTo(contest.deadline, now);
  if (dl == null) return 'HIDDEN';

  // 진행중: D-8 이상
  if (dl >= RULES.ongoingMinDays) return 'ONGOING';

  // 마감임박: D-7 ~ D-day
  if (dl >= 0 && dl <= RULES.urgentMaxDays) return 'URGENT';

  // 마감됨(최근 7일): D+1 ~ D+7  => daysLeft는 -1 ~ -7
  if (dl < 0 && dl >= -RULES.closedVisibleDays) return 'CLOSED_RECENT';

  // 더 오래된 마감은 숨김
  return 'HIDDEN';
}

export function splitContestsByStatus(contests: Contest[], now: Date = new Date()) {
  const ongoing: Contest[] = [];
  const urgent: Contest[] = [];
  const closedRecent: Contest[] = [];

  for (const c of contests) {
    const st = getContestStatus(c, now);
    if (st === 'ONGOING') ongoing.push(c);
    else if (st === 'URGENT') urgent.push(c);
    else if (st === 'CLOSED_RECENT') closedRecent.push(c);
  }

  // 정렬: 진행/임박은 마감 빠른 순, 최근마감은 최근 순
  ongoing.sort((a, b) => (parseYmd(a.deadline)?.getTime() ?? 9e15) - (parseYmd(b.deadline)?.getTime() ?? 9e15));
  urgent.sort((a, b) => (parseYmd(a.deadline)?.getTime() ?? 9e15) - (parseYmd(b.deadline)?.getTime() ?? 9e15));
  closedRecent.sort((a, b) => (parseYmd(b.deadline)?.getTime() ?? 0) - (parseYmd(a.deadline)?.getTime() ?? 0));

  return { ongoing, urgent, closedRecent };
}
