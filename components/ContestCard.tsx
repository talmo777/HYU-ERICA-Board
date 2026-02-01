import React from 'react';
import { Calendar, Tag, ExternalLink } from 'lucide-react';
import { Contest } from '../types';

interface ContestCardProps {
  contest: Contest;
  onClick: () => void;
}

const getDDay = (deadline: string) => {
  const now = new Date();
  const end = new Date(deadline);
  // Reset time to start of day for accurate day calculation
  now.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  
  const diffTime = end.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return '마감';
  if (diffDays === 0) return 'D-Day';
  return `D-${diffDays}`;
};

const ContestCard: React.FC<ContestCardProps> = ({ contest, onClick }) => {
  const dDay = getDDay(contest.deadline);
  const isUrgent = dDay.startsWith('D-') && parseInt(dDay.split('-')[1]) <= 7;

  return (
    <div 
      onClick={onClick}
      className="bg-white border border-slate-200 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col h-full overflow-hidden group"
    >
      {/* Top Badge Area */}
      <div className="p-4 pb-2 flex justify-between items-start">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          isUrgent ? 'bg-red-100 text-red-800' : 
          dDay === '마감' ? 'bg-slate-100 text-slate-600' : 'bg-blue-100 text-blue-800'
        }`}>
          {dDay}
        </span>
        <span className="text-xs text-slate-500 font-medium px-2 py-0.5 bg-slate-50 rounded border border-slate-100">
          {contest.category}
        </span>
      </div>

      {/* Content */}
      <div className="px-4 py-2 flex-grow">
        <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-900 transition-colors line-clamp-2 mb-2">
          {contest.title}
        </h3>
        <p className="text-sm text-slate-500 mb-2 flex items-center gap-1">
            <span className="font-semibold">{contest.organizer}</span>
        </p>
        <p className="text-xs text-slate-400 line-clamp-2">
          {contest.summary}
        </p>
      </div>

      {/* Footer Info */}
      <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center text-xs text-slate-500">
          <Calendar size={14} className="mr-1" />
          {contest.deadline} 마감
        </div>
        <button className="text-blue-600 hover:text-blue-800 text-xs font-medium flex items-center">
          상세보기
        </button>
      </div>
    </div>
  );
};

export default ContestCard;
