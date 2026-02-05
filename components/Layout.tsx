import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Menu, X, ExternalLink, MessageCircle, Instagram } from 'lucide-react';
import { HYU_LOGO_URL, MOYEON_LINK_URL, MOYEON_LOGO_URL, INSTAGRAM_URL, KAKAO_CHANNEL_URL } from '../constants';
import { NavItem } from '../types';

interface LayoutProps {
  children: React.ReactNode;
}

const navItems: NavItem[] = [
  { label: '공모전', path: '/contests' },
  { label: '캘린더', path: '/calendar' },
  { label: '이용안내', path: '/guide' },
  { label: 'Feedback', path: '/feedback' },
];

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <NavLink to="/" className="flex items-center gap-2">
                <img className="h-10 w-auto object-contain" src={HYU_LOGO_URL} alt="HYU Logo" />
                <div className="flex flex-col">
                  <span className="font-bold text-slate-900 text-lg leading-tight">HY-LINK</span>
                  <span className="text-xs text-slate-500 font-medium tracking-wider">공모전 통합 게시판</span>
                </div>
              </NavLink>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex space-x-8">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                      isActive
                        ? 'border-blue-900 text-blue-900'
                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={toggleMobileMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100 focus:outline-none"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200">
            <div className="pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                      isActive
                        ? 'border-blue-900 text-blue-900 bg-blue-50'
                        : 'border-transparent text-slate-500 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-700'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-slate-800 text-slate-300 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            
            {/* Social Links */}
            <div className="flex flex-col items-center md:items-start space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">SNS & Contact</h3>
              <div className="flex space-x-4">
                <a 
                  href={INSTAGRAM_URL} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-slate-400 hover:text-white transition-colors flex items-center gap-1"
                >
                  <Instagram size={20} />
                  <span className="text-sm">Instagram</span>
                </a>
                <a 
                  href={KAKAO_CHANNEL_URL} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-slate-400 hover:text-yellow-400 transition-colors flex items-center gap-1"
                >
                  <MessageCircle size={20} />
                  <span className="text-sm">카카오톡 채널</span>
                </a>
              </div>
            </div>

            {/* Info */}
            <div className="text-center text-sm text-slate-500">
              <p>본 사이트는 한양대학교 ERICA 학생들을 위한 정보 제공용이며, <br/>학교 공식 행정 시스템과는 무관합니다.</p>
              <p className="mt-2">Copyright © 2026. All rights reserved.</p>
            </div>

            {/* Cooperation */}
            <div className="flex flex-col items-center md:items-end space-y-3">
               <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Cooperated With</h3>
               <a 
                href={MOYEON_LINK_URL} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-2 bg-slate-700 px-4 py-2 rounded hover:bg-slate-600 transition-colors"
               >
                 <span className="text-sm font-bold text-white">모두의연구소</span>
                 <img src={MOYEON_LOGO_URL} alt="모두의연구소" className="h-5 w-auto rounded-sm" />
                 <ExternalLink size={14} className="text-slate-400"/>
               </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
