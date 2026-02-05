import BenefitMarkdownPage from '../../src/components/BenefitMarkdownPage';
import md from '../../src/content/benefits/icpbl-mileage.md?raw';

export default function IcPblMileagePage() {
  return (
    <BenefitMarkdownPage
      title="IC-PBL 수강 시 마일리지 적립"
      markdown={md}
      highlights={[
        { label: '장학금 전환 기준', value: '5,000점', hint: '누적 마일리지' },
        { label: '장학금', value: '10만원', hint: '승인 시 지급' },
        { label: '대상', value: 'ERICA 학부 재학생', hint: '대학원생 제외' },
        { label: '문의', value: '031-400-4896', hint: 'IC-PBL센터' },
      ]}
      actions={[
        { label: 'HY-LU-E에서 마일리지 확인', href: 'https://hylu-e.hanyang.ac.kr', variant: 'primary' },
        { label: '신청 기간 공지 확인', href: 'https://hylu-e.hanyang.ac.kr', variant: 'secondary' },
      ]}
    />
  );
}

