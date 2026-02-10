// pages/CalendarPage.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Contest } from '../types';
import ContestModal from '../components/ContestModal';
import { fetchContestsForUserWeb } from '../src/services/contestSource';
import { parseYmd, startOfToday ,ymd } from '../src/utils/contestDate';

type FieldKey = '창업' | 'IT/SW' | '디자인' | '마케팅' | '공학' | '인문/사회';

type PrizeRange = 'ALL' | 'UNDER_100' | '100_300' | '300_1000' | 'OVER_1000';

type EventKind = 'START' | 'DEADLINE';

const FIELD_RULES: Record<FieldKey, RegExp> = {
  '창업': /창업|스타트업|사업화|BM|아이디어/i,
  'IT/SW': /IT|SW|소프트웨어|개발|코딩|해커톤|AI|데이터|앱|웹|알고리즘/i,
  '디자인': /디자인|포스터|로고|UX|UI|영상|콘텐츠/i,
  '마케팅': /마케팅|홍보|브랜딩|SNS|캠페인/i,
  '공학': /공학|제조|로봇|기계|전기|전자|화학|반도체/i,
  '인문/사회': /인문|사회|글쓰기|에세이|독서|정책|문화|역사/i,
};

type CalendarEvent = { kind: EventKind; contest: Contest };

function eventBadge(e: CalendarEvent, today: Date) {
  if (e.kind === 'START') {
    return { label: '신청 시작', cls: 'bg-blue-100 text-blue-800' };
  }

  // DEADLINE: 오늘 기준으로 과거면 회색(신청 마감), 미래/오늘이면 빨강(마감일)
  const end = parseYmd(e.contest.deadline) ?? parseYmd(e.contest.end_date);
  if (!end) return { label: '마감일', cls: 'bg-red-100 text-red-800' };

  const dleft = daysUntil(end, today);
  if (dleft < 0) return { label: '신청 마감', cls: 'bg-slate-200 text-slate-700' };
  return { label: '마감일', cls: 'bg-red-100 text-red-800' };
}

function parsePrizeKRW(summary: string): number | null {
  // 매우 러프: "총 상금 500만원", "상금 1,000만원", "1억" 등
  const s = summary.replace(/\s/g, '');
  // 억
  const eok = s.match(/(\d+(?:\.\d+)?)억/);
  if (eok) return Math.round(parseFloat(eok[1]) * 100000000);
  // 만원
  const man = s.match(/(\d{1,3}(?:,\d{3})*|\d+)(?:만원|만)/);
  if (man) return parseInt(man[1].replace(/,/g, ''), 10) * 10000;
  return null;
}

function matchPrizeRange(prizeKRW: number | null, range: PrizeRange): boolean {
  if (range === 'ALL') return true;
  if (prizeKRW == null) return false;

  const man = prizeKRW / 10000; // 만원 단위로 판단
  if (range === 'UNDER_100') return man < 100;
  if (range === '100_300') return man >= 100 && man < 300;
  if (range === '300_1000') return man >= 300 && man < 1000;
  return man >= 1000;
}

function isTeamRecruiting(c: Contest): boolean {
  const txt = `${c.title} ${c.summary} ${(c.tags || []).join(' ')}`;
  return /팀원모집|팀원\s*모집|리크루팅|recruit/i.test(txt);
}

const CalendarPage: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedContest, setSelectedContest] = useState<Contest | null>(null);

  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Sidebar filters
  const [field, setField] = useState<Record<FieldKey, boolean>>({
    '창업': false, 'IT/SW': false, '디자인': false, '마케팅': false, '공학': false, '인문/사회': false,
  });
  const [prizeRange, setPrizeRange] = useState<PrizeRange>('ALL');
  const [teamOnly, setTeamOnly] = useState(false);

  const handlePrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    fetchContestsForUserWeb()
      .then((data) => {
        if (!mounted) return;
        setContests(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (!mounted) return;
        setError('캘린더 데이터를 불러오지 못했습니다.');
        setContests([]);
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => { mounted = false; };
  }, []);

  const today = useMemo(() => new Date(), []);

  const filteredContests = useMemo(() => {
    const activeFields = Object.entries(field).filter(([, v]) => v).map(([k]) => k as FieldKey);

    return contests.filter((c) => {
      // 1) 관심 분야(tags/title/summary에 룰 적용)
      if (activeFields.length) {
        const text = `${c.title} ${c.summary} ${(c.tags || []).join(' ')}`;
        const ok = activeFields.some((f) => FIELD_RULES[f].test(text));
        if (!ok) return false;
      }

      // 2) 상금 규모(요약에서 파싱)
      const prize = parsePrizeKRW(c.summary || '');
      if (!matchPrizeRange(prize, prizeRange)) return false;

      // 3) 팀원 모집
      if (teamOnly && !isTeamRecruiting(c)) return false;

      return true;
    });
  }, [contests, field, prizeRange, teamOnly]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  // 달력 표시: (요청) 신청 시작(start_date), 마감일(deadline/end_date), 신청 마감(마감 이후엔 같은 날짜에 회색)
  const eventsByDate: Record<number, CalendarEvent[]> = useMemo(() => {
    const map: Record<number, CalendarEvent[]> = {};

    const add = (date: Date, e: CalendarEvent) => {
      if (date.getFullYear() !== year || date.getMonth() !== month) return;
      const day = date.getDate();
      if (!map[day]) map[day] = [];
      map[day].push(e);
    };

    filteredContests.forEach((c) => {
      const start = parseYmd(c.start_date);
      const end = parseYmd(c.deadline) ?? parseYmd(c.end_date);

      if (start) add(start, { kind: 'START', contest: c });
      if (end) add(end, { kind: 'DEADLINE', contest: c });
    });

    // stable sort: START first then DEADLINE, then title
    Object.keys(map).forEach((k) => {
      const d = Number(k);
      map[d].sort((a, b) => {
        if (a.kind !== b.kind) return a.kind === 'START' ? -1 : 1;
        return a.contest.title.localeCompare(b.contest.title, 'ko');
      });
    });

    return map;
  }, [filteredContests, year, month]);

  const todayYmd = ymd(new Date());
  const todaysDeadlines = useMemo(() => {
    return filteredContests
      .filter((c) => c.deadline === todayYmd)
      .sort((a, b) => a.title.localeCompare(b.title, 'ko'));
  }, [filteredContests, todayYmd]);

  const calendarDays: React.ReactNode[] = [];

  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(<div key={`empty-${i}`} className="bg-slate-50 min-h-[110px] border border-slate-100" />);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();
    const dayEvents = eventsByDate[day] || [];

    calendarDays.push(
      <div
        key={day}
        className={`bg-white min-h-[110px] border border-slate-100 p-2 hover:bg-slate-50 relative ${isToday ? 'bg-blue-50/50' : ''}`}
      >
        <div className={`text-sm font-semibold mb-1 ${isToday ? 'text-blue-600' : 'text-slate-700'}`}>
          {day}
        </div>

        <div className="space-y-1">
          {dayEvents.slice(0, 3).map((e) => {
            const b = eventBadge(e, new Date());
            return (
              <button
                key={`${e.kind}-${e.contest.id}`}
                onClick={() => setSelectedContest(e.contest)}
                className={`block w-full text-left text-[11px] px-1.5 py-1 rounded truncate border border-transparent hover:border-slate-200 transition ${b.cls}`}
                title={e.contest.title}
              >
                <span className="font-semibold mr-1">[{b.label}]</span>{e.contest.title}
              </button>
            );
          })}
          {dayEvents.length > 3 && (
            <div className="text-[11px] text-slate-500 px-1">
              +{dayEvents.length - 3}개 더보기
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
      {/* ===== Sidebar ===== */}
      <aside className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 h-fit lg:sticky lg:top-6">
        <div className="text-sm font-semibold text-slate-900 mb-3">필터</div>

        <div className="mb-5">
          <div className="text-xs font-semibold text-slate-600 mb-2">관심 분야</div>
          <div className="space-y-2">
            {(Object.keys(field) as FieldKey[]).map((k) => (
              <label key={k} className="flex items-center gap-2 text-sm text-slate-800">
                <input
                  type="checkbox"
                  checked={field[k]}
                  onChange={() => setField((p) => ({ ...p, [k]: !p[k] }))}
                  className="w-4 h-4"
                />
                {k}
              </label>
            ))}
          </div>
        </div>

        <div className="mb-5">
          <div className="text-xs font-semibold text-slate-600 mb-2">상금 규모</div>
          <select
            value={prizeRange}
            onChange={(e) => setPrizeRange(e.target.value as PrizeRange)}
            className="w-full px-3 py-2 rounded-lg border bg-white text-sm"
          >
            <option value="ALL">전체</option>
            <option value="UNDER_100">100만원 미만</option>
            <option value="100_300">100~300만원</option>
            <option value="300_1000">300~1000만원</option>
            <option value="OVER_1000">1000만원 이상</option>
          </select>
          <div className="text-[11px] text-slate-500 mt-1">
            * 요약(summary)에서 금액을 추정해 분류(없으면 제외됨)
          </div>
        </div>

        <div className="mb-6">
          <div className="text-xs font-semibold text-slate-600 mb-2">추가 옵션</div>
          <label className="flex items-center gap-2 text-sm text-slate-800">
            <input
              type="checkbox"
              checked={teamOnly}
              onChange={() => setTeamOnly((v) => !v)}
              className="w-4 h-4"
            />
            팀원 모집 중인 공모전만
          </label>
        </div>

        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-semibold text-slate-900">오늘의 마감</div>
            <div className="text-xs text-slate-500">{todayYmd}</div>
          </div>

          {todaysDeadlines.length === 0 ? (
            <div className="text-sm text-slate-500">오늘 마감 공모전 없음</div>
          ) : (
            <div className="space-y-2">
              {todaysDeadlines.slice(0, 6).map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedContest(c)}
                  className="w-full text-left rounded-lg border px-3 py-2 hover:bg-slate-50"
                >
                  <div className="text-sm font-semibold text-slate-900 truncate">{c.title}</div>
                  <div className="text-xs text-slate-500 truncate">{c.organizer}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      </aside>

      {/* ===== Main Calendar ===== */}
      <main className="space-y-6">
        <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900">
            {year}년 {month + 1}월
          </h2>
          <div className="flex gap-2">
            <button
              onClick={handlePrevMonth}
              className="p-2 hover:bg-slate-100 rounded-full border border-slate-300"
              aria-label="이전 달"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-2 hover:bg-slate-100 rounded-full border border-slate-300"
              aria-label="다음 달"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {loading && (
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 text-slate-600">
            캘린더 데이터를 불러오는 중...
          </div>
        )}

        {!loading && error && (
          <div className="bg-white rounded-lg shadow-sm border border-red-200 p-4 text-red-600">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
            <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50">
              {['일', '월', '화', '수', '목', '금', '토'].map((dayLabel, idx) => (
                <div
                  key={dayLabel}
                  className={`py-3 text-center text-sm font-medium ${
                    idx === 0 ? 'text-red-500' : idx === 6 ? 'text-blue-500' : 'text-slate-500'
                  }`}
                >
                  {dayLabel}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7">{calendarDays}</div>
          </div>
        )}

        <ContestModal
          isOpen={!!selectedContest}
          contest={selectedContest}
          onClose={() => setSelectedContest(null)}
        />
      </main>
    </div>
  );
};

export default CalendarPage;
