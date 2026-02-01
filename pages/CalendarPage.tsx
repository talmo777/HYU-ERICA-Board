import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { mockContests } from '../data/mockContests';
import { Contest } from '../types';
import ContestModal from '../components/ContestModal';

const CalendarPage: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedContest, setSelectedContest] = useState<Contest | null>(null);

  // Helper Functions
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };
  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  // Map contests to dates (based on deadline)
  const eventsByDate: { [key: number]: Contest[] } = {};
  mockContests.forEach(contest => {
    const d = new Date(contest.deadline);
    if (d.getFullYear() === year && d.getMonth() === month) {
      const day = d.getDate();
      if (!eventsByDate[day]) eventsByDate[day] = [];
      eventsByDate[day].push(contest);
    }
  });

  const calendarDays = [];
  // Empty slots for previous month
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(<div key={`empty-${i}`} className="bg-slate-50 min-h-[100px] border border-slate-100"></div>);
  }
  // Actual days
  for (let day = 1; day <= daysInMonth; day++) {
    const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();
    const dayEvents = eventsByDate[day] || [];

    calendarDays.push(
      <div key={day} className={`bg-white min-h-[100px] border border-slate-100 p-2 transition-colors hover:bg-slate-50 relative ${isToday ? 'bg-blue-50/50' : ''}`}>
        <div className={`text-sm font-semibold mb-1 ${isToday ? 'text-blue-600 inline-block bg-blue-100 rounded-full w-6 h-6 text-center leading-6' : 'text-slate-700'}`}>
          {day}
        </div>
        <div className="space-y-1">
          {dayEvents.map(event => (
            <button
              key={event.id}
              onClick={() => setSelectedContest(event)}
              className="block w-full text-left text-xs px-1.5 py-1 rounded bg-blue-100 text-blue-900 truncate hover:bg-blue-200 transition-colors"
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
          <button onClick={handlePrevMonth} className="p-2 hover:bg-slate-100 rounded-full border border-slate-300">
            <ChevronLeft size={20} />
          </button>
          <button onClick={handleNextMonth} className="p-2 hover:bg-slate-100 rounded-full border border-slate-300">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50">
          {['일', '월', '화', '수', '목', '금', '토'].map((day, idx) => (
            <div key={day} className={`py-3 text-center text-sm font-medium ${idx === 0 ? 'text-red-500' : idx === 6 ? 'text-blue-500' : 'text-slate-500'}`}>
              {day}
            </div>
          ))}
        </div>
        {/* Days Grid */}
        <div className="grid grid-cols-7">
          {calendarDays}
        </div>
      </div>

      <ContestModal 
        isOpen={!!selectedContest} 
        contest={selectedContest} 
        onClose={() => setSelectedContest(null)} 
      />
    </div>
  );
};

export default CalendarPage;
