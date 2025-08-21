
'use client';
import Link from "next/link";
import { useMemo, useState } from "react";
import { posts as rawNews } from "@/lib/news";
import { cases as rawCases } from "@/lib/cases";

type Tab = 'all' | 'news' | 'cases';

export default function InsightsPage(){
  const [tab, setTab] = useState<Tab>('all');
  const newsPosts = Array.isArray(rawNews) ? rawNews : [];
  const caseStudies = Array.isArray(rawCases) ? rawCases : [];

  const allItems = useMemo(() => {
    const a = newsPosts.map(p => ({ type: 'news' as const, date: p?.date || '', title: p?.title || 'Untitled', href: p?.slug ? `/news/${p.slug}` : '#', summary: p?.summary || '', author: p?.author || '' }));
    const b = caseStudies.map(c => ({ type: 'cases' as const, date: c?.date || '', title: c?.title || 'Untitled case study', href: c?.slug ? `/case-studies/${c.slug}` : '#', summary: Array.isArray(c?.goals) && c.goals.length ? c.goals.slice(0,2).join(' • ') : '', sector: c?.sector || '' }));
    const merged = [...a, ...b];
    return merged.sort((x,y) => new Date(y.date).getTime() - new Date(x.date).getTime());
  }, [newsPosts, caseStudies]);

  const items = tab === 'all' ? allItems : tab === 'news' ? allItems.filter(i=>i.type==='news') : allItems.filter(i=>i.type==='cases');

  return (
    <main className="container mx-auto px-6 py-12 space-y-10">
      <header className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold">Insights</h1>
        <p className="text-gray-700 mt-2">News & case studies from The Curry Club.</p>

        {/* Tabs */}
        <div className="inline-flex mt-6 rounded-full border bg-white overflow-hidden">
          {(['all','news','cases'] as Tab[]).map(t => (
            <button
              key={t}
              onClick={()=>setTab(t)}
              className={"px-4 py-2 text-sm " + (tab===t ? "bg-amber-100 text-amber-800" : "hover:bg-gray-50")}
            >
              {t==='all' ? 'All' : t==='news' ? 'News' : 'Case Studies'}
            </button>
          ))}
        </div>
      </header>

      <section>
        <div className="grid md:grid-cols-2 gap-6">
          {items.map((it, idx) => (
            <Link key={idx} href={it.href} className="block border rounded-xl p-5 hover:shadow-soft transition bg-white">
              <div className="flex items-center justify-between gap-3">
                <span className={"text-xs px-2 py-0.5 rounded-full " + (it.type==='news' ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800")}>
                  {it.type==='news' ? 'News' : 'Case Study'}
                </span>
                <span className="text-xs text-gray-500">{it.date ? new Date(it.date).toLocaleDateString() : ""}</span>
              </div>
              <div className="text-lg font-semibold mt-2">{it.title}</div>
              {it.summary && <p className="text-gray-600 mt-1">{it.summary}</p>}
              {it.sector && <div className="text-xs text-gray-500 mt-2">{it.sector}</div>}
            </Link>
          ))}
          {items.length === 0 && <p className="text-gray-500">No items yet.</p>}
        </div>
      </section>
    </main>
  );
}
