'use client'
import { useMemo, useState, useEffect } from 'react'
import Image from 'next/image'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { type Product } from '@/lib/products'
import SpiceIndicator from './SpiceIndicator'
import Modal from '@/components/ui/modal'

const heats = ['Any','Mild','Medium','Hot'] as const

type Initial = { q: string; heat: typeof heats[number]; cat: string }
export default function ProductsClient({ initial, catalog }:{ initial: Initial; catalog: Product[] }){
  const router = useRouter(); const pathname = usePathname(); const sp = useSearchParams();
  const [q, setQ] = useState(initial.q); const [heat, setHeat] = useState<Initial['heat']>(initial.heat); const [cat, setCat] = useState(initial.cat);
  const [sel, setSel] = useState<Product|null>(null)

  // Build category list from catalog
  const cats = useMemo(()=>['All Categories', ...Array.from(new Set(catalog.map(p=>p.category)))], [catalog])

  // Sync state -> URL
  useEffect(()=>{
    const params = new URLSearchParams(sp?.toString());
    if(q) params.set('q', q); else params.delete('q');
    if(heat && heat!=='Any') params.set('heat', heat); else params.delete('heat');
    if(cat && cat!=='All Categories') params.set('cat', cat); else params.delete('cat');
    const qs = params.toString(); router.replace(qs ? `${pathname}?${qs}` : pathname);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, heat, cat]);

  const filtered = useMemo(()=>{
    return catalog.filter(p => {
      const matchesQ = q ? (p.name.toLowerCase().includes(q.toLowerCase()) || p.description?.toLowerCase().includes(q.toLowerCase())) : true
      const matchesHeat = heat==='Any' ? true : p.heat===heat
      const matchesCat = cat==='All Categories' ? true : p.category===cat
      return matchesQ && matchesHeat && matchesCat
    })
  }, [catalog, q, heat, cat])

  const groups = useMemo(()=>{
    const by = new Map<string, Product[]>()
    for(const p of filtered){
      const key = p.category
      if(!by.has(key)) by.set(key, [])
      by.get(key)!.push(p)
    }
    return Array.from(by.entries())
  }, [filtered])

  function DietBadge({diet}:{diet: Product['diet']}){
    if(!diet) return null
    const cls = diet==='Vegan' ? 'badge badge-vegan' : 'badge badge-veg'
    return <span className={cls}>{diet}</span>
  }

  function Card({p}:{p:Product}){
  function open(){ setSel(p) }
  function key(e: React.KeyboardEvent){ if(e.key==='Enter' || e.key===' '){ e.preventDefault(); open(); } }
  return (
    <div
      className="card overflow-hidden hover:shadow-soft transition cursor-pointer focus-within:ring-2 focus-within:ring-amber-600"
      role="button" tabIndex={0} onClick={open} onKeyDown={key}
    >
      <div className="relative aspect-[16/11]">
        <Image src={p.image || '/images/placeholder.png'} alt={p.alt || p.name} fill sizes="(max-width:768px) 50vw, (max-width:1200px) 33vw, 300px" className="object-cover" />
      </div>
      <div className="card-body grid gap-2">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-semibold">{p.name}</h3>
          <SpiceIndicator heat={p.heat} />
        </div>
        <p className="text-sm text-gray-600 min-h-10">{p.description}</p>
        <div className="flex flex-wrap items-center gap-2 min-h-8">
          {p.ready && <span className="badge badge-soft">Ready in {p.ready}</span>}
          <DietBadge diet={p.diet} />
          {p.tags?.map(t => <span key={t} className="badge badge-soft">{t}</span>)}
        </div>
      </div>
    </div>
  )
}

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold">Products</h1>
      <p className="text-gray-600 mt-2 max-w-2xl">Build consistent menus with our portion‑based sauces and kits.</p>

      <div className="mt-6 grid sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <input className="border rounded-xl px-3 py-2 sm:col-span-2" placeholder="Search products..." value={q} onChange={e=>setQ(e.target.value)} />
        <select className="border rounded-xl px-3 py-2" value={heat} onChange={e=>setHeat(e.target.value as any)}>
          {heats.map(h=><option key={h}>{h}</option>)}
        </select>
        <select className="border rounded-xl px-3 py-2 sm:col-span-2" value={cat} onChange={e=>setCat(e.target.value)}>
          {cats.map(c=><option key={c}>{c}</option>)}
        </select>
      </div>

      <p className="mt-3 text-sm text-gray-600" aria-live="polite">{filtered.length} result{filtered.length===1?'':'s'}</p>

      {groups.map(([section, items]) => (
        <section key={section} className="mt-10">
          <h2 className="text-2xl font-bold tracking-tight border-b pb-2">{section}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
            {items.map(p => <Card key={p.slug} p={p} />)}
          </div>
        </section>
      ))}

      <Modal open={!!sel} onClose={()=>setSel(null)} title={sel?.name}>
        {sel && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="relative aspect-[4/3]">
              <Image src={sel.image || '/images/placeholder.png'} alt={sel.alt || sel.name} fill className="object-cover rounded-xl" />
            </div>
            <div>
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-semibold">{sel.name}</h3>
                <SpiceIndicator heat={sel.heat} />
              </div>
              <p className="text-gray-700 mt-2">{sel.description}</p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {sel.ready && <span className="badge badge-soft">Ready in {sel.ready}</span>}
                <DietBadge diet={sel.diet} />
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                <a href={`/products/${sel.slug}`} className="btn btn-outline rounded-xl" data-autofocus>View full details</a>
                <a href={`/contact?ref=product-${sel.slug}`} className="btn btn-primary rounded-xl">Enquire / Request Demo</a>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
