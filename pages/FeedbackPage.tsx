import React from "react";
import { AIRTABLE_FEEDBACK_FORM_URL } from "../constants";
import { MessageSquarePlus, ExternalLink } from "lucide-react";

const FeedbackPage: React.FC = () => {
  const openInNewTab = () => {
    if (!AIRTABLE_FEEDBACK_FORM_URL) return;
    // embed 링크를 공유 링크로 바꿔 새 탭에서도 잘 열리게(선택)
    const directUrl = AIRTABLE_FEEDBACK_FORM_URL.replace("/embed/", "/");
    window.open(directUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <MessageSquarePlus className="text-blue-900" />
            피드백
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            서비스 이용 중 불편한 점이나 추가하고 싶은 기능이 있다면 알려주세요.
          </p>
        </div>

        {AIRTABLE_FEEDBACK_FORM_URL && (
          <button
            onClick={openInNewTab}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm border border-slate-200 rounded-md hover:bg-slate-50"
          >
            <ExternalLink size={16} />
            새 탭으로 열기
          </button>
        )}
      </div>

      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        {AIRTABLE_FEEDBACK_FORM_URL ? (
          <iframe
            className="airtable-embed"
            src={AIRTABLE_FEEDBACK_FORM_URL}
            frameBorder="0"
            width="100%"
            height="680"
            style={{ background: "transparent" }}
            title="Feedback Form"
          />
        ) : (
          <div className="h-[480px] flex flex-col items-center justify-center text-slate-400 bg-slate-50">
            <MessageSquarePlus size={48} className="mb-4 opacity-50" />
            <p className="text-lg font-medium">피드백 폼 준비중입니다.</p>
            <p className="text-sm mt-2">
              constants.ts의 AIRTABLE_FEEDBACK_FORM_URL 값을 설정해주세요.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackPage;
