import React from 'react';
import { Info, ExternalLink, Bell, Calendar } from 'lucide-react';

const GuidePage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">이용안내</h1>
        <p className="text-slate-600">
          한양대 ERICA 공모전 통합 게시판을 100% 활용하는 방법을 알려드립니다.
        </p>
      </div>

      <div className="grid gap-6">
        {/* Card 1 */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 flex gap-4">
          <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-900">
            <Info size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">이 사이트가 하는 일</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              학교 홈페이지, 단과대 게시판, LINC 3.0 사업단 등 여러 곳에 흩어져 있는 
              <strong> 교내 공모전, 서포터즈, IC-PBL 프로그램 정보</strong>를 한곳에서 모아볼 수 있습니다. 
              더 이상 정보를 놓쳐서 장학금 기회를 날리지 마세요.
            </p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 flex gap-4">
          <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-900">
            <ExternalLink size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">신청은 어떻게 하나요?</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              이 사이트는 정보 제공만을 목적으로 합니다. 
              각 공모전 카드의 <strong>'신청 링크'</strong> 버튼을 누르면, 실제 주최 부서의 신청 페이지(구글 폼, HY-LU 등)로 
              바로 연결됩니다. 별도의 회원가입 없이 이용하세요.
            </p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 flex gap-4">
          <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-900">
            <Calendar size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">데이터 출처 및 정확도</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              학교 공식 웹사이트의 공개된 공지사항을 기반으로 데이터를 수집합니다. 
              정보 업데이트 시차가 발생할 수 있으므로, 반드시 <strong>'원문 보기'</strong>를 통해 
              최종 내용을 확인해주시기 바랍니다.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-10 p-6 bg-slate-100 rounded-lg text-center">
        <p className="text-slate-700 mb-4 font-medium">서비스에 대한 건의사항이나 오류 제보는 언제든 환영합니다.</p>
        <a href="#/feedback" className="inline-block bg-slate-800 text-white px-6 py-2 rounded-md hover:bg-slate-700 transition-colors">
            피드백 남기러 가기
        </a>
      </div>
    </div>
  );
};

export default GuidePage;
