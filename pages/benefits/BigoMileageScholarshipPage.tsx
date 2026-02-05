import BenefitMarkdownPage from '../../src/components/BenefitMarkdownPage';
import md from '../../src/content/benefits/erica-bigo-sch.md?raw';

export default function BigoMileageScholarshipPage() {
  return <BenefitMarkdownPage title="비교과 마일리지 장학금 신청" markdown={md} />;
}
