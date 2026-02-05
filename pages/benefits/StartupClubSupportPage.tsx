import BenefitMarkdownPage from '../../src/components/BenefitMarkdownPage';
import md from '../../src/content/benefits/erica-startup-club.md?raw';

export default function StartupClubSupportPage() {
  return <BenefitMarkdownPage title="창업 동아리 지원금 및 추가 모집" markdown={md} />;
}
