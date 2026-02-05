import React from 'react';

const IcPblMileagePage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-6">
        <div className="text-sm text-slate-500">놓치기 쉬운 혜택</div>
        <h1 className="text-2xl font-bold text-slate-900">IC-PBL 수강 시 마일리지 적립</h1>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
        <section>
          <h2 className="font-semibold text-slate-900 mb-2">핵심 요약</h2>
          <ul className="list-disc pl-5 text-slate-700 space-y-1">
            <li>IC-PBL 교과목 수강생은 ERICA-WALLET/HY-LU-E에서 마일리지가 적립됨</li>
            <li>오리엔테이션 참석 및 수강 완료 등 조건에 따라 적립</li>
            <li>누적 5,000 이상이면 마일리지 장학금 전환 신청(승인 시 5,000 차감, 10만원 지급)</li>
          </ul>
        </section>

        <section>
          <h2 className="font-semibold text-slate-900 mb-2">문의</h2>
          <ul className="list-disc pl-5 text-slate-700 space-y-1">
            <li>IC-PBL센터: 031-400-4896</li>
            <li>교육성과관리팀: 031-400-4908</li>
          </ul>
        </section>

        <div className="pt-2">
          <a
            href="/docs/icpbl-mileage-guide.pdf"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800"
          >
            원문(PDF) 열기
          </a>
          <div className="text-xs text-slate-500 mt-2">
            * 상세 기준/절차는 학기별 공지에 따라 달라질 수 있음
          </div>
        </div>
      </div>
    </div>
  );
};

export default IcPblMileagePage;
