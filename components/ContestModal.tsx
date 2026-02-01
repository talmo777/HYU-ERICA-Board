import React from 'react';
import { X, Calendar, User, Tag, ExternalLink, Link as LinkIcon, AlertCircle } from 'lucide-react';
import { Contest } from '../types';

interface ContestModalProps {
  contest: Contest | null;
  isOpen: boolean;
  onClose: () => void;
}

const ContestModal: React.FC<ContestModalProps> = ({ contest, isOpen, onClose }) => {
  if (!isOpen || !contest) return null;

  const handleApplyClick = () => {
    window.open(contest.apply_url, "_blank");
  };

  const handleSourceClick = () => {
    window.open(contest.source_url, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900 bg-opacity-50 transition-opacity" 
        onClick={onClose}
      ></div>

      <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">
          
          {/* Header */}
          <div className="bg-slate-50 px-4 py-4 sm:px-6 flex justify-between items-start border-b border-slate-100">
            <div>
              <h3 className="text-xl font-bold leading-6 text-slate-900" id="modal-title">
                {contest.title}
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                {contest.organizer} | {contest.category}
              </p>
            </div>
            <button
              type="button"
              className="rounded-md bg-white text-slate-400 hover:text-slate-500 focus:outline-none"
              onClick={onClose}
            >
              <span className="sr-only">Close</span>
              <X size={24} />
            </button>
          </div>

          {/* Body */}
          <div className="px-4 py-6 sm:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Image if available, or placeholder info */}
              <div className="aspect-video bg-slate-100 rounded-lg overflow-hidden flex items-center justify-center">
                 {contest.imageUrl ? (
                    <img src={contest.imageUrl} alt={contest.title} className="w-full h-full object-cover" />
                 ) : (
                    <span className="text-slate-400">이미지 없음</span>
                 )}
              </div>

              {/* Key Info */}
              <div className="space-y-4">
                 <div className="flex items-start gap-3">
                    <Calendar className="text-blue-900 mt-1 flex-shrink-0" size={20} />
                    <div>
                        <p className="text-sm font-semibold text-slate-900">접수 기간</p>
                        <p className="text-sm text-slate-600">
                            {contest.start_date || '미정'} ~ {contest.deadline}
                        </p>
                    </div>
                 </div>
                 <div className="flex items-start gap-3">
                    <User className="text-blue-900 mt-1 flex-shrink-0" size={20} />
                    <div>
                        <p className="text-sm font-semibold text-slate-900">참가 대상</p>
                        <p className="text-sm text-slate-600">{contest.target}</p>
                    </div>
                 </div>
                 <div className="flex items-start gap-3">
                    <Tag className="text-blue-900 mt-1 flex-shrink-0" size={20} />
                    <div className="flex flex-wrap gap-1">
                        {contest.tags.map((tag, idx) => (
                             <span key={idx} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                                 #{tag}
                             </span>
                        ))}
                    </div>
                 </div>
              </div>
            </div>

            <div className="mt-6">
                <h4 className="text-base font-semibold text-slate-900 mb-2">상세 내용</h4>
                <div className="bg-slate-50 p-4 rounded-md text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                    {contest.summary}
                    <br/><br/>
                    * 본 내용은 요약정보입니다. 반드시 원문 공지를 확인하세요.
                </div>
            </div>
          </div>

          {/* Footer / Actions */}
          <div className="bg-slate-50 px-4 py-4 sm:flex sm:flex-row-reverse sm:px-6 gap-3 border-t border-slate-100">
            <button
              type="button"
              className="inline-flex w-full justify-center rounded-md bg-blue-900 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-800 sm:w-auto items-center gap-2"
              onClick={handleApplyClick}
            >
              신청하러 가기 <ExternalLink size={16} />
            </button>
            <button
              type="button"
              className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50 sm:mt-0 sm:w-auto items-center gap-2"
              onClick={handleSourceClick}
            >
              원문 공지 보기 <LinkIcon size={16} />
            </button>
          </div>
           
           <div className="bg-yellow-50 px-4 py-2 text-xs text-yellow-800 flex items-center justify-center gap-2">
             <AlertCircle size={14} />
             <span>신청 및 접수는 외부 사이트(학교 공식 홈페이지 등)로 이동하여 진행됩니다.</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ContestModal;
