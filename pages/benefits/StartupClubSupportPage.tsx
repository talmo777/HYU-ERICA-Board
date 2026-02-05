import React from 'react';

const StartupClubSupportPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-6">
        <div className="text-sm text-slate-500">놓치기 쉬운 혜택</div>
        <h1 className="text-2xl font-bold text-slate-900">창업 동아리 지원금 추가 모집</h1>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
        <section>
          <h2 className="font-semibold text-slate-900 mb-2">핵심 요약</h2>
          <ul className="list-disc pl-5 text-slate-700 space-y-1">
            <li>창업교육센터(EEC) 중심으로 창업동아리 선발 및 단계별 지원(공간/멘토링/시제품 등)</li>
            <li>정기 모집 외에, 상황에 따라 “추가 모집”이 별도 공고로 열릴 수 있음</li>
            <li>공지 채널: 창업교육센터 홈페이지 공지 + HY-LU-E 프로그램 공고</li>
          </ul>
        </section>

        <section>
          <h2 className="font-semibold text-slate-900 mb-2">확인 팁</h2>
          <ul className="list-disc pl-5 text-slate-700 space-y-1">
            <li>추가 모집은 고정 패턴이 아니라 예산/운영 상황에 따라 변동</li>
            <li>모집 공고에서 활동기간, 지원금/등급 구조, 제출서류, 심사방식 확인</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default StartupClubSupportPage;
