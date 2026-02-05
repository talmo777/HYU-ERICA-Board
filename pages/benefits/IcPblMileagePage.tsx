import BenefitMarkdownPage from '../../src/components/BenefitMarkdownPage';
import md from '../../src/content/benefits/icpbl-mileage.md?raw';

export default function IcPblMileagePage() {
  return <BenefitMarkdownPage title="IC-PBL 수강 시 마일리지 적립" markdown={md} />;
}
