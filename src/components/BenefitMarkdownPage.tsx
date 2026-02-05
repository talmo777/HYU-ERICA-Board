import React, { useMemo } from 'react';
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

export default function BenefitMarkdownPage({ title, markdown, highlights = [], actions = [] }: Props) {
  const toc = useMemo(() => extractToc(markdown), [markdown]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">
      {/* TOC */}
      <aside className="hidden lg:block sticky top-6 h-fit">
        <div className="text-xs font-semibold text-slate-500 mb-2">목차</div>
        <div className="bg-white border border-slate-200 rounded-xl p-3 space-y-2">
          {toc.length === 0 && (
            <div className="text-sm text-slate-500">목차를 만들려면 ## 제목 형태로 작성</div>
          )}
          {toc.map((t) => (
            <a
              key={t.id}
              href={`#${t.id}`}
              className={[
                'block text-sm hover:underline text-slate-700',
                t.level === 3 ? 'pl-3 text-slate-600' : 'pl-0 font-medium',
              ].join(' ')}
            >
              {t.text}
            </a>
          ))}
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
                  <div key={h.label} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <div className="text-xs font-semibold text-slate-500">{h.label}</div>
                    <div className="text-lg font-bold text-slate-900 mt-1">{h.value}</div>
                    {h.hint && <div className="text-xs text-slate-500 mt-1">{h.hint}</div>}
                  </div>
                ))}
              </div>
            )}

            {actions.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {actions.map((a) => (
                  <a
                    key={a.href}
                    href={a.href}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-2 rounded-lg border border-slate-300 text-sm hover:bg-slate-50"
                  >
                    {a.label}
                  </a>
                ))}
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
                  <h2 id={id} className="mt-10 mb-3 text-lg font-bold text-slate-900 scroll-mt-24">
                    {children}
                  </h2>
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
              p: ({ children }) => <p className="text-slate-700 leading-7 my-3">{children}</p>,
              ul: ({ children }) => <ul className="my-3 space-y-1">{children}</ul>,
              ol: ({ children }) => <ol className="my-3 space-y-1 list-decimal pl-6">{children}</ol>,
              li: ({ children }) => <li className="ml-5 list-disc text-slate-700 leading-7">{children}</li>,
              blockquote: ({ children }) => (
                <div className="my-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-slate-700">
                  {children}
                </div>
              ),
              hr: () => <div className="my-8 border-t border-slate-200" />,
              table: ({ children }) => (
                <div className="overflow-x-auto my-4">
                  <table className="min-w-[560px] border border-slate-200 rounded-lg">{children}</table>
                </div>
              ),
              th: ({ children }) => (
                <th className="border border-slate-200 bg-slate-50 px-3 py-2 text-left text-sm">
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="border border-slate-200 px-3 py-2 text-sm text-slate-700">
                  {children}
                </td>
              ),
              // FAQ(아코디언): md에서 <details><summary> 형태 쓰면 스타일만 입힘
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
      </main>
    </div>
  );
}
