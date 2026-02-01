import React, { useState, useMemo } from 'react';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import ContestCard from '../components/ContestCard';
import ContestModal from '../components/ContestModal';
import { mockContests } from '../data/mockContests';
import { Contest, Category } from '../types';

const ContestListPage: React.FC = () => {
  const [selectedContest, setSelectedContest] = useState<Contest | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'ALL'>('ALL');
  const [sortOrder, setSortOrder] = useState<'DEADLINE' | 'NEWEST'>('DEADLINE');

  // Filter & Sort Logic
  const filteredContests = useMemo(() => {
    let result = mockContests;

    // Category Filter
    if (selectedCategory !== 'ALL') {
      result = result.filter(c => c.category === selectedCategory);
    }

    // Search Filter
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(c => 
        c.title.toLowerCase().includes(lowerTerm) || 
        c.organizer.toLowerCase().includes(lowerTerm) ||
        c.tags.some(tag => tag.toLowerCase().includes(lowerTerm))
      );
    }

    // Sorting
    if (sortOrder === 'DEADLINE') {
      // Closest deadline first
      result = [...result].sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
    } else {
      // Newest (assuming ID reflects creation or we check start_date if strictly needed, but let's assume random for mock)
      result = [...result].sort((a, b) => b.id.localeCompare(a.id));
    }

    return result;
  }, [searchTerm, selectedCategory, sortOrder]);

  const categories: (Category | 'ALL')[] = ['ALL', '교내 공모전', '서포터즈', 'IC-PBL'];

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Sidebar Filters (Desktop) / Top Filters (Mobile) */}
      <aside className="w-full md:w-64 flex-shrink-0 space-y-6">
        
        {/* Category Nav */}
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
                    ? 'bg-blue-50 text-blue-900 font-bold border border-blue-100' 
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {cat === 'ALL' ? '전체보기' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Additional Filters Mock UI */}
        <div className="hidden md:block bg-white border border-slate-200 rounded-lg shadow-sm p-4">
             <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3">상태 필터</h3>
             <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                    <input type="checkbox" className="rounded text-blue-900 focus:ring-blue-900" defaultChecked />
                    접수중
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                    <input type="checkbox" className="rounded text-blue-900 focus:ring-blue-900" />
                    마감임박 (D-7)
                </label>
             </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-grow">
        
        {/* Search & Sort Bar */}
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <div className="relative flex-grow max-w-lg">
                    <input 
                        type="text" 
                        placeholder="공모전 제목, 주최, 태그 검색..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent text-sm"
                    />
                    <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
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

        {/* Results Info */}
        <div className="mb-4 text-sm text-slate-500">
            총 <span className="font-bold text-blue-900">{filteredContests.length}</span>개의 공모전이 있습니다.
        </div>

        {/* Grid */}
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
                    onClick={() => {setSearchTerm(''); setSelectedCategory('ALL');}}
                    className="mt-4 text-blue-900 text-sm font-medium hover:underline"
                >
                    필터 초기화
                </button>
            </div>
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
