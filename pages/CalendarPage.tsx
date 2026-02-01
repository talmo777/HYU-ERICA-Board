import React, { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Contest } from '../types';
import ContestModal from '../components/ContestModal';
import { fetchContestsForUserWeb } from '../services/contestSource';

const CalendarPage: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedContest, setSelectedContest] = useState<Contest | null>(null);

  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Helper Functions
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

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

    return () => {
      mounted = false;
    };
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  // Map contests to dates (based on deadline)
  const eventsByDate: Record<number, Contest[]> = useMemo(() => {
    const map: Record<number, Contest[]> = {};

    contests.forEach((contest) => {
      // contest.deadline은 YYYY-MM-DD 형태가 많아서 new Date() 파싱이 브라우저별로 다를 수 있음
      // 안전하게 ISO로 변환해 파싱
      const raw = contest.deadline;
      const d = raw ? new Date(`${raw}T00:00:00`) : null;
      if (!d || Number.isNaN(d.getTime())) return;

      if (d.getFullYear() === year && d.getMonth() === month) {
        const day = d.getDate();
        if (!map[day]) map[day] = [];
        map[day].push(contest);
      }
    });

    // 동일 날짜 내 정렬(마감일/제목)
    Object.keys(map).forEach((k) => {
      const day = Number(k);
      map[day].sort((a, b) => {
        const ad = new Date(`${a.deadline}T00:00:00`).getTime();
        const bd = new Date(`${b.deadline}T00:00:00`).getTime();
        if (ad !== bd) return ad - bd;
        return a.title.localeCompare(b.title, 'ko');
      });
    });

    return map;
  }, [contests, year, month]);

  const calendarDays: React.ReactNode[] = [];

  // Empty slots for previous month
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(
      <div key={`empty-${i}`} className="bg-slate-50 min-h-[100px] border border-slate-100"></div>
    );
  }

  // Actual days
  for (let day = 1; day <= daysInMonth; day++) {
    const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();
    const dayEvents = eventsByDate[day] || [];

    calendarDays.push(
      <div
        key={day}
        className={`bg-white min-h-[100px] border border-slate-100 p-2 transition-colors hover:bg-slate-50 relative ${
          isToday ? 'bg-blue-50/50' : ''
        }`}
      >
        <div
          className={`text-sm font-semibold mb-1 ${
            isToday
              ? 'text-blue-600 inline-block bg-blue-100 rounded-full w-6 h-6 text-center leading-6'
              : 'text-slate-700'
          }`}
        >
          {day}
        </div>

        <div className="space-y-1">
          {dayEvents.map((event) => (
            <button
              key={event.id}
              onClick={() => setSelectedContest(event)}
              className="block w-full text-left text-xs px-1.5 py-1 rounded bg-blue-100 text-blue-900 truncate hover:bg-blue-200 transition-colors"
              title={event.title}
            >
              [마감] {event.title}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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

      {/* 상태 영역 */}
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
          {/* Weekday Headers */}
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

          {/* Days Grid */}
          <div className="grid grid-cols-7">{calendarDays}</div>
        </div>
      )}

      <ContestModal
        isOpen={!!selectedContest}
        contest={selectedContest}
        onClose={() => setSelectedContest(null)}
      />
    </div>
  );
};

export default CalendarPage;
