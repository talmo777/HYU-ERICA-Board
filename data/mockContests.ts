import { Contest } from '../types';

// 날짜 계산을 위한 헬퍼 (오늘 기준)
const today = new Date();
const formatDate = (date: Date) => date.toISOString().split('T')[0];
const addDays = (days: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() + days);
  return formatDate(d);
};

export const mockContests: Contest[] = [
  {
    id: "c1",
    title: "2024학년도 1학기 HY-Lion 창업 아이디어 경진대회",
    organizer: "창업교육센터",
    category: "교내 공모전",
    deadline: addDays(3), // D-3
    start_date: addDays(-10),
    tags: ["창업", "아이디어", "장학금"],
    target: "ERICA 재학생(휴학생 포함)",
    summary: "학생들의 창의적인 창업 아이디어를 발굴하고 사업화를 지원하기 위한 교내 경진대회입니다. 총 상금 500만원.",
    source_url: "https://example.com/notice/1",
    apply_url: "https://example.com/apply/1",
    imageUrl: "https://picsum.photos/400/200?random=1"
  },
  {
    id: "c2",
    title: "제5회 소프트웨어 융합 해커톤",
    organizer: "SW중심대학사업단",
    category: "교내 공모전",
    deadline: addDays(7), // D-7
    start_date: addDays(-5),
    tags: ["개발", "해커톤", "밤샘"],
    target: "SW전공 및 융합전공생",
    summary: "무박 2일간 진행되는 SW 해커톤. AI, IoT, Web/App 등 자유 주제로 진행됩니다.",
    source_url: "https://example.com/notice/2",
    apply_url: "https://example.com/apply/2",
    imageUrl: "https://picsum.photos/400/200?random=2"
  },
  {
    id: "c3",
    title: "2024 하계방학 IC-PBL 현장실습 참여자 모집",
    organizer: "IC-PBL센터",
    category: "IC-PBL",
    deadline: addDays(14),
    start_date: addDays(0),
    tags: ["인턴십", "현장실습", "학점인정"],
    target: "3, 4학년 재학생",
    summary: "기업과 연계하여 실제 현장 문제를 해결하는 IC-PBL 현장실습 프로그램입니다.",
    source_url: "https://example.com/notice/3",
    apply_url: "https://example.com/apply/3",
    imageUrl: "https://picsum.photos/400/200?random=3"
  },
  {
    id: "c4",
    title: "제12기 희망한대 서포터즈 모집",
    organizer: "사회봉사단",
    category: "서포터즈",
    deadline: addDays(5),
    start_date: addDays(-2),
    tags: ["봉사", "대외활동", "홍보"],
    target: "전교생",
    summary: "한양대학교 ERICA의 건학이념인 사랑의 실천을 널리 알릴 서포터즈를 모집합니다.",
    source_url: "https://example.com/notice/4",
    apply_url: "https://example.com/apply/4",
    imageUrl: "https://picsum.photos/400/200?random=4"
  },
  {
    id: "c5",
    title: "2024 ERICA 학술정보관 독서 감상문 대회",
    organizer: "학술정보관",
    category: "교내 공모전",
    deadline: addDays(20),
    start_date: addDays(-1),
    tags: ["독서", "글쓰기", "교양"],
    target: "학부생 전체",
    summary: "지정 도서를 읽고 독서 감상문을 제출하세요. 우수작에게는 총장 명의 상장이 수여됩니다.",
    source_url: "https://example.com/notice/5",
    apply_url: "https://example.com/apply/5",
    imageUrl: "https://picsum.photos/400/200?random=5"
  },
  {
    id: "c6",
    title: "2024-2학기 캡스톤디자인 옥션마켓",
    organizer: "LINC 3.0 사업단",
    category: "교내 공모전",
    deadline: addDays(1), // D-1
    start_date: addDays(-20),
    tags: ["캡스톤", "전시", "작품"],
    target: "캡스톤디자인 수강생",
    summary: "한 학기 동안 수행한 캡스톤디자인 결과물을 전시하고 기업과 매칭하는 옥션마켓입니다.",
    source_url: "https://example.com/notice/6",
    apply_url: "https://example.com/apply/6",
    imageUrl: "https://picsum.photos/400/200?random=6"
  },
  {
    id: "c7",
    title: "AI 융합 전공 설명회 및 로고 디자인 공모전",
    organizer: "인공지능융합연구센터",
    category: "교내 공모전",
    deadline: addDays(10),
    start_date: addDays(-3),
    tags: ["디자인", "AI", "로고"],
    target: "전교생",
    summary: "신설되는 AI 융합 전공을 상징하는 창의적인 로고를 디자인해주세요.",
    source_url: "https://example.com/notice/7",
    apply_url: "https://example.com/apply/7",
    imageUrl: "https://picsum.photos/400/200?random=7"
  },
  {
    id: "c8",
    title: "2024 외국인 유학생 멘토링 프로그램 멘토 모집",
    organizer: "국제처",
    category: "교내 공모전",
    deadline: addDays(8),
    start_date: addDays(1),
    tags: ["멘토링", "국제교류", "봉사"],
    target: "재학생(한국인)",
    summary: "외국인 유학생들의 학교 생활 적응을 도울 멘토를 모집합니다.",
    source_url: "https://example.com/notice/8",
    apply_url: "https://example.com/apply/8",
    imageUrl: "https://picsum.photos/400/200?random=8"
  },
  {
    id: "c9",
    title: "2024 ERICA 사진 공모전: 캠퍼스의 봄",
    organizer: "홍보팀",
    category: "교내 공모전",
    deadline: addDays(15),
    start_date: addDays(5),
    tags: ["사진", "예술", "캠퍼스"],
    target: "전교생 및 교직원",
    summary: "아름다운 에리카 캠퍼스의 봄 풍경을 담은 사진을 공모합니다.",
    source_url: "https://example.com/notice/9",
    apply_url: "https://example.com/apply/9",
    imageUrl: "https://picsum.photos/400/200?random=9"
  },
  {
    id: "c10",
    title: "교내 셔틀버스 개선 아이디어 공모",
    organizer: "총무관리처",
    category: "교내 공모전",
    deadline: addDays(25),
    start_date: addDays(0),
    tags: ["교통", "복지", "아이디어"],
    target: "전교생",
    summary: "더 편리한 셔틀버스 운행을 위한 학생 여러분의 소중한 의견을 기다립니다.",
    source_url: "https://example.com/notice/10",
    apply_url: "https://example.com/apply/10",
    imageUrl: "https://picsum.photos/400/200?random=10"
  },
];
