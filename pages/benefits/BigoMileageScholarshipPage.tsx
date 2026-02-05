import React from 'react';

const BigoMileageScholarshipPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-6">
        <div className="text-sm text-slate-500">놓치기 쉬운 혜택</div>
        <h1 className="text-2xl font-bold text-slate-900">비교과 포인트(마일리지) 장학금 신청</h1>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
        <section>
          <h2 className="font-semibold text-slate-900 mb-2">핵심 요약</h2>
          <ul className="list-disc pl-5 text-slate-700 space-y-1">
            <li>ERICA 학부 재학생 + HY-LU-E 누적 마일리지 5,000 이상이면 신청 가능</li>
            <li>승인 시 5,000 차감 → 장학금 100,000원 지급 구조</li>
            <li>신청 기간은 학기별 공지(예: 2023-2학기 10/30~11/10 사례)</li>
          </ul>
        </section>

        <section>
          <h2 className="font-semibold text-slate-900 mb-2">문의</h2>
          <ul className="list-disc pl-5 text-slate-700 space-y-1">
            <li>교육성과관리팀: 031-400-4908</li>
          </ul>
        </section>

        <div className="text-xs text-slate-500">
          * 최신 신청 기간/세부 요건은 HY-LU-E 및 학교 공지를 기준으로 확인
        </div>
      </div>
    </div>
  );
};

export default BigoMileageScholarshipPage;
