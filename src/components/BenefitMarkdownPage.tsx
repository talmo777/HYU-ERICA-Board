import React, { useEffect, useMemo, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type Highlight = {
  label: string;
  value: string;
  hint?: string;
};

type Action = {
  label: string;
  href: string;
  variant?: 'primary' | 'secondary';
};

type Props = {
  title: string;
  markdown: string;
  highlights?: Highlight[];
  actions?: Action[];
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w가-힣\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

function extractToc(md: string) {
  const lines = md.split('\n');
  const toc: { level: number; text: string; id: string }[] = [];
  for (const line of lines) {
    const m = line.match(/^(#{2,3})\s+(.+?)\s*$/);
    if (!m) continue;
    const level = m[1].length; // 2 or 3
    const text = m[2].trim();
    const id = slugify(text);
    toc.push({ level, text, id });
  }
  return toc;
}

export default function BenefitMarkdownPage({
  title,
  markdown,
  highlights = [],
  actions = [],
}: Props) {
  const toc = useMemo(() => extractToc(markdown), [markdown]);

  // ----- ScrollSpy
  const [activeId, setActiveId] = useState<string>(toc[0]?.id ?? '');
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (!toc.length) return;

    // clean up previous
    observerRef.current?.disconnect();

    const ids = toc.map((t) => t.id);
    const els = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    // IntersectionObserver: 섹션의 상단이 viewport에 들어오면 active 갱신
    observerRef.current = new IntersectionObserver(
      (entries) => {
        // 화면에 들어온 것 중, 가장 위쪽(혹은 가장 큰 intersection)을 선택
        const visible = entries
          .filter((e) => e.isIntersecting)
          .map((e) => ({
            id: (e.target as HTMLElement).id,
            top: (e.target as HTMLElement).getBoundingClientRect().top,
            ratio: e.intersectionRatio,
          }))
          .sort((a, b) => a.top - b.top || b.ratio - a.ratio);

        if (visible[0]?.id) setActiveId(visible[0].id);
      },
      {
        root: null,
        // 헤더/상단 여백 고려: 위쪽 기준으로 조금 일찍 잡히게
        rootMargin: '-96px 0px -70% 0px',
        threshold: [0.1, 0.25, 0.5],
      }
    );

    els.forEach((el) => observerRef.current?.observe(el));

    return () => observerRef.current?.disconnect();
  }, [toc]);

  const [showTop, setShowTop] = useState(false);
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">
      {/* TOC */}
      <aside className="hidden lg:block sticky top-6 h-fit">
        <div className="text-xs font-semibold text-slate-500 mb-2">목차</div>
        <div className="bg-white border border-slate-200 rounded-xl p-3">
          {toc.length === 0 ? (
            <div className="text-sm text-slate-500">
              목차를 만들려면 <span className="font-mono">##</span> 제목 형태로 작성
            </div>
          ) : (
            <nav className="space-y-1">
              {toc.map((t) => {
                const isActive = t.id === activeId;
                return (
                  <a
                    key={t.id}
                    href={`#${t.id}`}
                    className={[
                      'block text-sm rounded-md px-2 py-1 transition',
                      t.level === 3 ? 'ml-3 text-slate-600' : 'text-slate-700 font-medium',
                      isActive
                        ? 'bg-slate-900 text-white'
                        : 'hover:bg-slate-50 hover:text-slate-900',
                    ].join(' ')}
                    aria-current={isActive ? 'true' : 'false'}
                  >
                    {t.text}
                  </a>
                );
              })}
            </nav>
          )}
        </div>
      </aside>

      {/* Content */}
      <main className="space-y-6">
        {/* Header */}
        <div>
          <div className="text-sm text-slate-500">놓치기 쉬운 혜택</div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">{title}</h1>
        </div>

        {/* Highlights + Actions */}
        {(highlights.length > 0 || actions.length > 0) && (
          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            {highlights.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {highlights.map((h) => (
                  <div
                    key={h.label}
                    className="rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:shadow-sm hover:border-slate-300"
                  >
                    <div className="text-xs font-semibold text-slate-500">{h.label}</div>
                    <div className="text-[20px] font-extrabold tracking-tight text-slate-900 mt-1">
                      {h.value}
                    </div>
                    {h.hint && <div className="text-xs text-slate-500 mt-1">{h.hint}</div>}
                  </div>
                ))}
              </div>
            )}

            {actions.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {actions.map((a) => {
                  const variant = a.variant ?? 'secondary';
                  const cls =
                    variant === 'primary'
                      ? 'bg-slate-900 text-white border-slate-900 hover:bg-slate-800'
                      : 'bg-white text-slate-900 border-slate-300 hover:bg-slate-50';
                  return (
                    <a
                      key={a.href + a.label}
                      href={a.href}
                      target="_blank"
                      rel="noreferrer"
                      className={[
                        'px-3 py-2 rounded-lg border text-sm font-semibold transition',
                        cls,
                      ].join(' ')}
                    >
                      {a.label}
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Markdown Body */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h2: ({ children }) => {
                const text = String(children);
                const id = slugify(text);
                return (
                  <div className="mt-10">
                    <div className="border-t border-slate-200 mb-6" />
                    <h2 id={id} className="mb-3 text-lg font-bold text-slate-900 scroll-mt-24">
                      {children}
                    </h2>
                  </div>
                );
              },
              h3: ({ children }) => {
                const text = String(children);
                const id = slugify(text);
                return (
                  <h3 id={id} className="mt-6 mb-2 text-base font-semibold text-slate-900 scroll-mt-24">
                    {children}
                  </h3>
                );
              },
              p: ({ children }) => (
                <p className="text-slate-700 leading-[1.85] text-[15px] my-3">{children}</p>
              ),
              strong: ({ children }) => <strong className="text-slate-900 font-semibold">{children}</strong>,
              ul: ({ children }) => <ul className="my-3 space-y-1">{children}</ul>,
              ol: ({ children }) => <ol className="my-3 space-y-1 list-decimal pl-6">{children}</ol>,
              li: ({ children }) => (
                <li className="ml-5 list-disc text-slate-700 leading-[1.85] text-[15px]">{children}</li>
              ),
              blockquote: ({ children }) => (
                <div className="my-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-slate-700">
                  {children}
                </div>
              ),
              hr: () => <div className="my-8 border-t border-slate-200" />,
              table: ({ children }) => (
                <div className="overflow-x-auto my-4">
                  <table className="min-w-[560px] border border-slate-200 rounded-lg overflow-hidden">
                    {children}
                  </table>
                </div>
              ),
              th: ({ children }) => (
                <th className="border border-slate-200 bg-slate-50 px-3 py-2 text-left text-sm font-semibold text-slate-700">
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="border border-slate-200 px-3 py-2 text-sm text-slate-700">
                  {children}
                </td>
              ),
              details: ({ children }) => (
                <details className="my-3 rounded-xl border border-slate-200 bg-white p-4">
                  {children}
                </details>
              ),
              summary: ({ children }) => (
                <summary className="cursor-pointer font-semibold text-slate-900">
                  {children}
                </summary>
              ),
            }}
          >
            {markdown}
          </ReactMarkdown>
        </div>

        {/* Back to top */}
        {showTop && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-6 right-6 px-3 py-2 rounded-full border border-slate-300 bg-white text-sm font-semibold shadow-sm hover:bg-slate-50 transition"
            aria-label="맨 위로"
          >
            Top
          </button>
        )}
      </main>
    </div>
  );
}
