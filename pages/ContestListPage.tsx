import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Search, Filter, SlidersHorizontal, RotateCw } from "lucide-react";
import ContestCard from "../components/ContestCard";
import ContestModal from "../components/ContestModal";
import { fetchContestsForUserWeb } from "../src/services/contestSource";
import { Contest, Category } from "../types";
import { getContestStatus } from "../src/utils/contestStatus";

type StatusFilter = "ALL" | "OPEN" | "URGENT"; // OPEN=진행중, URGENT=마감임박(D-7)

const ContestListPage: React.FC = () => {
  const [selectedContest, setSelectedContest] = useState<Contest | null>(null);

  const [contests, setContests] = useState<Contest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | "ALL">("ALL");
  const [sortOrder, setSortOrder] = useState<"DEADLINE" | "NEWEST">("DEADLINE");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");

  const loadContests = useCallback(async () => {
    try {
      setIsLoading(true);
      setLoadError(null);
      const data = await fetchContestsForUserWeb();
      setContests(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setLoadError(e?.message ?? "공모전 데이터를 불러오지 못했습니다.");
      setContests([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!mounted) return;
      await loadContests();
    })();
    return () => {
      mounted = false;
    };
  }, [loadContests]);

  const categories: (Category | "ALL")[] = useMemo(
    () => ["ALL", "교내 공모전", "서포터즈", "IC-PBL", "대외활동"],
    []
  );

  // (옵션) 날짜 없는 contest는 DEADLINE 정렬에서 맨 뒤로
  const safeDeadlineMs = (c: Contest) => {
    const d = c.deadline ? new Date(`${c.deadline}T00:00:00`) : null;
    const ms = d && !Number.isNaN(d.getTime()) ? d.getTime() : 9e15;
    return ms;
  };

  const filteredContests = useMemo(() => {
    let result = contests;

    // 0) 상태 필터: 딱 해당 상태만 뜨게
    if (statusFilter !== "ALL") {
      result = result.filter((c) => {
        const st = getContestStatus(c);
        if (statusFilter === "OPEN") return st === "ONGOING";
        if (statusFilter === "URGENT") return st === "URGENT";
        return true;
      });
    }

    // 1) 카테고리
    if (selectedCategory !== "ALL") {
      result = result.filter((c) => c.category === selectedCategory);
    }

    // 2) 검색
    const q = searchTerm.trim().toLowerCase();
    if (q) {
      result = result.filter((c) => {
        const title = (c.title || "").toLowerCase();
        const organizer = (c.organizer || "").toLowerCase();
        const tags = Array.isArray(c.tags) ? c.tags.join(" ").toLowerCase() : "";
        return title.includes(q) || organizer.includes(q) || tags.includes(q);
      });
    }

    // 3) 정렬
    if (sortOrder === "DEADLINE") {
      result = [...result].sort((a, b) => safeDeadlineMs(a) - safeDeadlineMs(b));
    } else {
      // NEWEST: id가 문자열이라면 기존 방식 유지(프로젝트에서 id 생성 규칙에 맞춰)
      result = [...result].sort((a, b) => String(b.id).localeCompare(String(a.id)));
    }

    return result;
  }, [contests, statusFilter, selectedCategory, searchTerm, sortOrder]);

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Sidebar */}
      <aside className="w-full md:w-64 flex-shrink-0 space-y-6">
        {/* Category */}
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3 flex items-center gap-2">
            <Filter size={16} /> 카테고리
          </h3>

          <div className="flex flex-row md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`flex-shrink-0 text-left px-3 py-2 rounded-md text-sm transition-colors ${
                  selectedCategory === cat
                    ? "bg-blue-50 text-blue-900 font-bold border border-blue-100"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                {cat === "ALL" ? "전체보기" : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Status Filter */}
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3">
            상태 필터
          </h3>

          <div className="flex md:flex-col gap-2">
            <button
              onClick={() => setStatusFilter("ALL")}
              className={`px-3 py-2 rounded-md text-sm text-left border transition ${
                statusFilter === "ALL"
                  ? "border-blue-200 bg-blue-50 text-blue-900 font-semibold"
                  : "border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              전체
            </button>
            <button
              onClick={() => setStatusFilter("OPEN")}
              className={`px-3 py-2 rounded-md text-sm text-left border transition ${
                statusFilter === "OPEN"
                  ? "border-blue-200 bg-blue-50 text-blue-900 font-semibold"
                  : "border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              접수중
            </button>
            <button
              onClick={() => setStatusFilter("URGENT")}
              className={`px-3 py-2 rounded-md text-sm text-left border transition ${
                statusFilter === "URGENT"
                  ? "border-blue-200 bg-blue-50 text-blue-900 font-semibold"
                  : "border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              마감임박 (D-7)
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-grow">
        {/* Search & Sort Bar */}
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="relative flex-grow max-w-lg flex items-center gap-2">
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder="공모전 제목, 주최, 태그 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent text-sm"
                />
                <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
              </div>

              {/* Reload Button */}
              <button
                onClick={loadContests}
                className="inline-flex items-center justify-center w-10 h-10 rounded-md border border-slate-300 hover:bg-slate-50 disabled:opacity-50"
                disabled={isLoading}
                title="데이터 새로고침"
                aria-label="reload"
              >
                <RotateCw size={18} className="text-slate-600" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <SlidersHorizontal size={18} className="text-slate-500" />
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as any)}
                className="border-none text-sm text-slate-700 font-medium focus:ring-0 bg-transparent cursor-pointer"
              >
                <option value="DEADLINE">마감임박순</option>
                <option value="NEWEST">최신등록순</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loading / Error */}
        {isLoading && (
          <div className="bg-white rounded-lg p-12 text-center border border-slate-200 border-dashed">
            <p className="text-slate-500">공모전 데이터를 불러오는 중...</p>
          </div>
        )}

        {!isLoading && loadError && (
          <div className="bg-white rounded-lg p-12 text-center border border-slate-200 border-dashed">
            <p className="text-slate-500 mb-3">{loadError}</p>
            <button onClick={loadContests} className="text-blue-900 text-sm font-medium hover:underline">
              다시 불러오기
            </button>
          </div>
        )}

        {/* Results */}
        {!isLoading && !loadError && (
          <>
            <div className="mb-4 text-sm text-slate-500">
              총 <span className="font-bold text-blue-900">{filteredContests.length}</span>개의 공모전이 있습니다.
            </div>

            {filteredContests.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredContests.map((contest) => (
                  <ContestCard
                    key={contest.id}
                    contest={contest}
                    onClick={() => setSelectedContest(contest)}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg p-12 text-center border border-slate-200 border-dashed">
                <p className="text-slate-400">검색 조건에 맞는 공모전이 없습니다.</p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("ALL");
                    setStatusFilter("ALL");
                  }}
                  className="mt-4 text-blue-900 text-sm font-medium hover:underline"
                >
                  필터 초기화
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <ContestModal
        isOpen={!!selectedContest}
        contest={selectedContest}
        onClose={() => setSelectedContest(null)}
      />
    </div>
  );
};

export default ContestListPage;
