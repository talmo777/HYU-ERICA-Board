import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, ChevronLeft, ArrowRight } from "lucide-react";
import ContestCard from "../components/ContestCard";
import ContestModal from "../components/ContestModal";
import { fetchContestsForUserWeb } from "../src/services/contestSource";
import { Contest } from "../types";
import { splitContestsByStatus } from "../src/utils/contestStatus";
import { parseYmd, startOfToday } from "../src/utils/contestDate";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [selectedContest, setSelectedContest] = useState<Contest | null>(null);

  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);

  // ===== Scroll-follow sidebar (JS clamp) =====
  const sidebarWrapRef = useRef<HTMLDivElement | null>(null);
  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const [sidebarStyle, setSidebarStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    const wrap = sidebarWrapRef.current;
    const sidebar = sidebarRef.current;
    if (!wrap || !sidebar) return;

    // 헤더 높이 + 여백. 네 레이아웃 기준으로 필요 시 80~140 사이 조절.
    const HEADER_OFFSET = 110;

    let raf = 0;

    const compute = () => {
      const scrollY = window.scrollY;

      const wrapRect = wrap.getBoundingClientRect();
      const wrapTop = scrollY + wrapRect.top;
      const wrapHeight = wrap.offsetHeight;

      const sidebarHeight = sidebar.offsetHeight;

      // fixed일 때 가로폭/좌표 유지
      const fixedWidth = wrapRect.width;
      const fixedLeft = wrapRect.left;

      // wrap 시작 지점부터 따라오되, header 아래에서 멈추게
      const startY = wrapTop - HEADER_OFFSET;

      // wrap 끝을 넘어서지 않게 clamp
      const endY = wrapTop + wrapHeight - sidebarHeight - HEADER_OFFSET;

      // wrap이 sidebar보다 짧으면 그냥 static
      if (wrapHeight <= sidebarHeight) {
        setSidebarStyle({
          position: "static",
          width: "auto",
          top: "auto",
          left: "auto",
        });
        return;
      }

      if (scrollY < startY) {
        // 시작 전: 문서 흐름
        setSidebarStyle({
          position: "static",
          width: "auto",
          top: "auto",
          left: "auto",
        });
        return;
      }

      if (scrollY > endY) {
        // 끝 이후: wrap 내부 bottom에 고정(absolute)
        setSidebarStyle({
          position: "absolute",
          top: wrapHeight - sidebarHeight,
          width: "100%",
          left: 0,
        });
        return;
      }

      // 중간: header 아래에서 fixed로 따라오기
      setSidebarStyle({
        position: "fixed",
        top: HEADER_OFFSET,
        width: fixedWidth,
        left: fixedLeft,
      });
    };

    const onScroll = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(compute);
    };

    const onResize = () => onScroll();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    // 초기 1회
    compute();

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // ===== contests fetch =====
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const list = await fetchContestsForUserWeb();
        if (mounted) setContests(Array.isArray(list) ? list : []);
      } catch (e) {
        console.error(e);
        if (mounted) setContests([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // 기간별 분리
  const { ongoing, urgent, closedRecent } = useMemo(
    () => splitContestsByStatus(contests),
    [contests]
  );

  // 마감 임박 캐러셀
  const [carouselIndex, setCarouselIndex] = useState(0);
  const itemsPerPage = 4;

  useEffect(() => {
    setCarouselIndex(0);
  }, [urgent.length]);

  const nextSlide = () => {
    if (carouselIndex + 1 <= urgent.length - itemsPerPage) {
      setCarouselIndex((prev) => prev + 1);
    }
  };

  const prevSlide = () => {
    if (carouselIndex > 0) {
      setCarouselIndex((prev) => prev - 1);
    }
  };

  // 캘린더 프리뷰(3주 이내 마감)
  const today = startOfToday();
  const threeWeeksLater = new Date(today);
  threeWeeksLater.setDate(today.getDate() + 21);

  const upcomingEvents = useMemo(() => {
    return [...contests]
      .filter((c) => {
        const d = parseYmd(c.deadline);
        return d && d >= today && d <= threeWeeksLater;
      })
      .sort(
        (a, b) =>
          (parseYmd(a.deadline)?.getTime() ?? 0) -
          (parseYmd(b.deadline)?.getTime() ?? 0)
      );
  }, [contests, today, threeWeeksLater]);

  return (
    <div className="space-y-12">
      {/* Intro Banner */}
      <section className="relative h-[280px] md:h-[360px] overflow-hidden rounded-2xl shadow-lg">
        <img
          src="https://image2url.com/r2/default/images/1770310683173-385b609a-ee75-4e9f-ad76-5f81ba78dc0c.png"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b102d]/90 via-[#2f3b82]/75 to-transparent" />
        <div className="relative z-10 h-full p-8 flex items-center">
          <div className="max-w-2xl text-white">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
              나에게 딱 맞는 공모전,
              <br />
              에리카에서 찾아보세요.
            </h1>

            <p className="text-white/90 mb-6 leading-relaxed">
              교내 각종 대회부터 서포터즈, IC-PBL 프로그램까지.
              <br />
              흩어져 있는 기회들을 한곳에 모았습니다.
            </p>

            <button
              onClick={() => navigate("/contests")}
              className="bg-white text-[#2f3b82] px-6 py-3 rounded-xl font-semibold hover:bg-slate-100 transition-colors inline-flex items-center gap-2"
            >
              공모전 전체보기 <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* ✅ 여기부터 "페이지 전체" 2컬럼 레이아웃 */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_360px] gap-8 items-start">
        {/* LEFT: 메인 컨텐츠 */}
        <div className="space-y-12">
          {/* 1) 진행 중인 공모전 */}
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <span className="w-2 h-8 bg-blue-900 rounded-sm inline-block"></span>
                진행 중인 공모전
              </h2>

              <button
                onClick={() => navigate("/contests")}
                className="text-sm text-slate-500 hover:text-blue-900 font-medium flex items-center"
              >
                전체보기 <ChevronRight size={16} />
              </button>
            </div>

            {loading ? (
              <div className="text-sm text-slate-400 py-6">불러오는 중…</div>
            ) : ongoing.length === 0 ? (
              <div className="text-sm text-slate-400 py-6">
                진행 중인 공모전이 없습니다.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {ongoing.slice(0, 6).map((contest) => (
                  <ContestCard
                    key={contest.id}
                    contest={contest}
                    onClick={() => setSelectedContest(contest)}
                  />
                ))}
              </div>
            )}
          </section>

          {/* 2) 마감 임박 공모전 (D-7) */}
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <span className="w-2 h-8 bg-blue-900 rounded-sm inline-block"></span>
                마감 임박 공모전 (D-7)
              </h2>

              <div className="flex gap-2">
                <button
                  onClick={prevSlide}
                  disabled={carouselIndex === 0}
                  className="p-2 rounded-full border border-slate-300 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={nextSlide}
                  disabled={carouselIndex >= urgent.length - itemsPerPage}
                  className="p-2 rounded-full border border-slate-300 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>

            {loading ? (
              <div className="text-sm text-slate-400 py-6">불러오는 중…</div>
            ) : urgent.length === 0 ? (
              <div className="text-sm text-slate-400 py-6">
                마감 임박 공모전이 없습니다.
              </div>
            ) : (
              <>
                <div className="relative overflow-hidden -mx-2">
                  <div
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{
                      transform: `translateX(-${
                        carouselIndex * (100 / itemsPerPage)
                      }%)`,
                    }}
                  >
                    {urgent.map((contest) => (
                      <div
                        key={contest.id}
                        className="w-full sm:w-1/2 md:w-1/2 lg:w-1/2 px-2 flex-shrink-0"
                      >
                        <div className="h-full">
                          <ContestCard
                            contest={contest}
                            onClick={() => setSelectedContest(contest)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <p className="text-center text-xs text-slate-400 mt-4 md:hidden">
                  좌우로 스와이프하여 더 보기
                </p>
              </>
            )}
          </section>

          {/* 3) 마감된 공모전 (최근 7일) */}
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <span className="w-2 h-8 bg-blue-900 rounded-sm inline-block"></span>
                마감된 공모전 (최근 7일)
              </h2>
            </div>

            {loading ? (
              <div className="text-sm text-slate-400 py-6">불러오는 중…</div>
            ) : closedRecent.length === 0 ? (
              <div className="text-sm text-slate-400 py-6">
                최근 7일 내 마감된 공모전이 없습니다.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 opacity-90">
                {closedRecent.slice(0, 6).map((contest) => (
                  <ContestCard
                    key={contest.id}
                    contest={contest}
                    onClick={() => setSelectedContest(contest)}
                  />
                ))}
              </div>
            )}
          </section>

          {/* 캘린더 프리뷰 */}
          <section>
            <div className="flex justify-between items-end mb-6">
              <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <span className="w-2 h-8 bg-blue-900 rounded-sm inline-block"></span>
                이번 달 주요 일정
              </h2>
              <button
                onClick={() => navigate("/calendar")}
                className="text-sm text-slate-500 hover:text-blue-900 font-medium flex items-center"
              >
                캘린더 전체보기 <ChevronRight size={16} />
              </button>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-6">
              {loading ? (
                <div className="text-center py-10 text-slate-400">
                  불러오는 중…
                </div>
              ) : upcomingEvents.length === 0 ? (
                <div className="text-center py-10 text-slate-400">
                  예정된 마감 일정이 없습니다.
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingEvents.map((event) => (
                    <div
                      key={event.id}
                      onClick={() => setSelectedContest(event)}
                      className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors group"
                    >
                      <div className="flex-shrink-0 w-16 text-center">
                        <div className="text-xs text-slate-500 uppercase font-semibold">
                          {parseYmd(event.deadline)?.toLocaleDateString("en-US", {
                            month: "short",
                          })}
                        </div>
                        <div className="text-xl font-bold text-slate-800">
                          {parseYmd(event.deadline)?.getDate()}
                        </div>
                      </div>

                      <div className="w-px h-10 bg-slate-200"></div>

                      <div className="flex-grow">
                        <div className="text-xs text-blue-600 font-medium mb-1">
                          {event.category}
                        </div>
                        <h4 className="text-slate-900 font-medium group-hover:text-blue-900 line-clamp-1">
                          {event.title}
                        </h4>
                      </div>

                      <div className="flex-shrink-0 hidden sm:block">
                        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                          마감일
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>

        {/* RIGHT: scroll-follow 위젯 (JS clamp) */}
        <aside className="hidden md:block">
          {/* wrap은 relative이어야 absolute 단계가 부모 기준으로 동작 */}
          <div ref={sidebarWrapRef} className="relative">
            <div ref={sidebarRef} style={sidebarStyle} className="space-y-6">
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 text-white shadow-md">
                <h3 className="font-bold text-lg mb-2">공모전 팁 & 가이드</h3>
                <p className="text-sm text-slate-300 mb-4">
                  공모전 처음이신가요? <br />
                  팀 빌딩부터 제안서 작성까지 꿀팁을 확인하세요.
                </p>
                <button
                  onClick={() => navigate("/guide")}
                  className="w-full bg-white/10 hover:bg-white/20 py-2 rounded text-sm transition-colors border border-white/20"
                >
                  가이드 보러가기
                </button>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-2">놓치기 쉬운 혜택</h3>
                <ul className="text-sm text-slate-600 space-y-2 list-none">
                  <li className="flex items-start gap-2">
                    <span className="mt-[7px] w-1 h-1 rounded-full bg-slate-400 shrink-0" />
                    <button
                      onClick={() => navigate("/benefits/icpbl-mileage")}
                      className="text-left hover:underline hover:text-slate-900"
                    >
                      IC-PBL 수강 시 마일리지 적립
                    </button>
                  </li>

                  <li className="flex items-start gap-2">
                    <span className="mt-[7px] w-1 h-1 rounded-full bg-slate-400 shrink-0" />
                    <button
                      onClick={() =>
                        navigate("/benefits/bigo-mileage-scholarship")
                      }
                      className="text-left hover:underline hover:text-slate-900"
                    >
                      비교과 포인트 장학금 신청 기간 확인
                    </button>
                  </li>

                  <li className="flex items-start gap-2">
                    <span className="mt-[7px] w-1 h-1 rounded-full bg-slate-400 shrink-0" />
                    <button
                      onClick={() => navigate("/benefits/startup-club-support")}
                      className="text-left hover:underline hover:text-slate-900"
                    >
                      창업 동아리 지원금 추가 모집
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <ContestModal
        isOpen={!!selectedContest}
        contest={selectedContest}
        onClose={() => setSelectedContest(null)}
      />
    </div>
  );
};

export default Home;
