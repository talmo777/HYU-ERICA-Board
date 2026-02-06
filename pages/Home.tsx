import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Calendar as CalendarIcon, ArrowRight } from 'lucide-react';
import ContestCard from '../components/ContestCard';
import ContestModal from '../components/ContestModal';
import { fetchContestsForUserWeb } from '../src/services/contestSource';
import { Contest } from '../types';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [selectedContest, setSelectedContest] = useState<Contest | null>(null);

  // 1. Carousel Logic (Imminent Deadlines)
  const urgentContests = fetchContestsForUserWeb
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
    .slice(0, 6); // Take top 6 imminent
  
  const [carouselIndex, setCarouselIndex] = useState(0);
  const itemsPerPage = 4; // Responsive handling done via CSS hiding, but logical index here

  const nextSlide = () => {
    if (carouselIndex + 1 <= urgentContests.length - itemsPerPage) {
        setCarouselIndex(prev => prev + 1);
    }
  };

  const prevSlide = () => {
    if (carouselIndex > 0) {
        setCarouselIndex(prev => prev - 1);
    }
  };

  // 2. Calendar Preview Logic (Next 3 weeks list)
  const today = new Date();
  const threeWeeksLater = new Date();
  threeWeeksLater.setDate(today.getDate() + 21);

  const upcomingEvents = fetchContestsForUserWeb.filter(c => {
    const d = new Date(c.deadline);
    return d >= today && d <= threeWeeksLater;
  }).sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());


  return (
    <div className="space-y-12">
      {/* Intro Banner */}
      <section className="relative h-[280px] md:h-[360px] overflow-hidden rounded-2xl shadow-lg">
        {/* background image */}
        <img
          src="https://image2url.com/r2/default/images/1770310683173-385b609a-ee75-4e9f-ad76-5f81ba78dc0c.png"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b102d]/90 via-[#2f3b82]/75 to-transparent" />

        {/* content */}
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
             onClick={() => navigate('/contests')}
             className="bg-white text-[#2f3b82] px-6 py-3 rounded-xl font-semibold hover:bg-slate-100 transition-colors inline-flex items-center gap-2"
           >
             공모전 전체보기 <ArrowRight size={18} />
           </button>
         </div>
       </div>
     </section>


      {/* Section 1: Imminent Deadlines Carousel */}
      <section>
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <span className="w-2 h-8 bg-blue-900 rounded-sm inline-block"></span>
                마감 임박 공모전
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
                    disabled={carouselIndex >= urgentContests.length - itemsPerPage} // Simple logic for desktop
                    className="p-2 rounded-full border border-slate-300 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                    <ChevronRight size={20} />
                </button>
            </div>
        </div>

        {/* Carousel Container */}
        <div className="relative overflow-hidden -mx-2">
            <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${carouselIndex * (100 / itemsPerPage)}%)` }}
            >
                {urgentContests.map((contest) => (
                    <div key={contest.id} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 px-2 flex-shrink-0">
                        <div className="h-full">
                            <ContestCard contest={contest} onClick={() => setSelectedContest(contest)} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
        
        {/* Mobile View Hint */}
        <p className="text-center text-xs text-slate-400 mt-4 md:hidden">
            좌우로 스와이프하여 더 보기
        </p>
      </section>

      {/* Section 2: Calendar Preview (Timeline) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
            <div className="flex justify-between items-end mb-6">
                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                    <span className="w-2 h-8 bg-blue-900 rounded-sm inline-block"></span>
                    이번 달 주요 일정
                </h2>
                <button 
                    onClick={() => navigate('/calendar')}
                    className="text-sm text-slate-500 hover:text-blue-900 font-medium flex items-center"
                >
                    캘린더 전체보기 <ChevronRight size={16} />
                </button>
            </div>
            
            <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-6">
                {upcomingEvents.length === 0 ? (
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
                                        {new Date(event.deadline).toLocaleDateString('en-US', { month: 'short' })}
                                    </div>
                                    <div className="text-xl font-bold text-slate-800">
                                        {new Date(event.deadline).getDate()}
                                    </div>
                                </div>
                                <div className="w-px h-10 bg-slate-200"></div>
                                <div className="flex-grow">
                                    <div className="text-xs text-blue-600 font-medium mb-1">{event.category}</div>
                                    <h4 className="text-slate-900 font-medium group-hover:text-blue-900 line-clamp-1">{event.title}</h4>
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
        </div>

        {/* Mini Banner / Widget */}
        <div className="md:col-span-1 space-y-6">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 text-white shadow-md">
                <h3 className="font-bold text-lg mb-2">공모전 팁 & 가이드</h3>
                <p className="text-sm text-slate-300 mb-4">
                    공모전 처음이신가요? <br/>
                    팀 빌딩부터 제안서 작성까지 꿀팁을 확인하세요.
                </p>
                <button onClick={() => navigate('/guide')} className="w-full bg-white/10 hover:bg-white/20 py-2 rounded text-sm transition-colors border border-white/20">
                    가이드 보러가기
                </button>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                 <h3 className="font-bold text-slate-800 mb-2">놓치기 쉬운 혜택</h3>
                 <ul className="text-sm text-slate-600 space-y-2 list-none">
                  <li className="flex items-start gap-2">
                    <span className="mt-[7px] w-1 h-1 rounded-full bg-slate-400 shrink-0" />
                    <button
                      onClick={() => navigate('/benefits/icpbl-mileage')}
                      className="text-left hover:underline hover:text-slate-900"
                    >
                      IC-PBL 수강 시 마일리지 적립
                    </button>
                  </li>

                  <li className="flex items-start gap-2">
                    <span className="mt-[7px] w-1 h-1 rounded-full bg-slate-400 shrink-0" />
                    <button
                      onClick={() => navigate('/benefits/bigo-mileage-scholarship')}
                      className="text-left hover:underline hover:text-slate-900"
                    >
                      비교과 포인트 장학금 신청 기간 확인
                    </button>
                  </li>

                  <li className="flex items-start gap-2">
                    <span className="mt-[7px] w-1 h-1 rounded-full bg-slate-400 shrink-0" />
                    <button
                      onClick={() => navigate('/benefits/startup-club-support')}
                      className="text-left hover:underline hover:text-slate-900"
                    >
                      창업 동아리 지원금 추가 모집
                    </button>
                  </li>
                </ul>
            </div>
        </div>
      </section>

      {/* Details Modal */}
      <ContestModal 
        isOpen={!!selectedContest} 
        contest={selectedContest} 
        onClose={() => setSelectedContest(null)} 
      />
    </div>
  );
};

export default Home;
