import React, { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type Props = {
  title: string;
  markdown: string;
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

export default function BenefitMarkdownPage({ title, markdown }: Props) {
  const toc = useMemo(() => extractToc(markdown), [markdown]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8">
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
      <main>
        <div className="mb-6">
          <div className="text-sm text-slate-500">놓치기 쉬운 혜택</div>
          <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
        </div>

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
            }}
          >
            {markdown}
          </ReactMarkdown>
        </div>
      </main>
    </div>
  );
}
