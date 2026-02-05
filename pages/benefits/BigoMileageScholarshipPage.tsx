import BenefitMarkdownPage from '../../src/components/BenefitMarkdownPage';
import md from '../../src/content/benefits/erica-bigo-sch.md?raw';

export default function BigoMileageScholarshipPage() {
  return (
    <BenefitMarkdownPage
      title="비교과 마일리지 장학금 신청"
      markdown={md}
      highlights={[
        { label: '전환 기준', value: '5,000점', hint: '누적 마일리지' },
        { label: '지급액', value: '10만원', hint: '승인 시 지급' },
        { label: '신청', value: '학기별 기간', hint: '공지 확인' },
        { label: '문의', value: '031-400-4908', hint: '교육성과관리팀' },
      ]}
      actions={[
        {
          label: 'HY-LU-E 바로가기',
          href: 'https://hylu-e.hanyang.ac.kr',
        },
        {
          label: '신청 기간 공지 확인',
          href: 'https://hylu-e.hanyang.ac.kr',
        },
      ]}
    />
  );
}
