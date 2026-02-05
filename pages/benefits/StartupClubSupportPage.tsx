import BenefitMarkdownPage from '../../src/components/BenefitMarkdownPage';
import md from '../../src/content/benefits/erica-startup-club.md?raw';

export default function StartupClubSupportPage() {
  return (
    <BenefitMarkdownPage
      title="창업 동아리 지원금 및 추가 모집"
      markdown={md}
      highlights={[
        { label: '핵심', value: '지원금/멘토링', hint: '프로그램별 상이' },
        { label: '모집', value: '정기+추가모집', hint: '수시 공지 확인' },
        { label: '대상', value: 'ERICA 재학생', hint: '요건은 공고 기준' },
        { label: '채널', value: '창업교육센터 공지', hint: '최신 공고 우선' },
      ]}
      actions={[
        {
          label: '창업교육센터 공지 확인',
          href: 'https://startup.hanyang.ac.kr',
        },
        {
          label: 'HY-LU-E 바로가기',
          href: 'https://hylue.hanyang.ac.kr',
        },
      ]}
    />
  );
}
