import ProductsClient from './products-client';
import { catalog } from '@/lib/products';
import type { Metadata } from 'next';

export const revalidate = 3600;

export function generateMetadata({ searchParams }:{ searchParams: Record<string,string|undefined> }): Metadata {
  const hasFilters = Boolean(searchParams.q || searchParams.heat || searchParams.cat);
  return {
    title: 'Products – The Curry Club',
    description: 'Sauces, curry kits, pastes and more for fast, consistent menus.',
    robots: hasFilters ? { index: false, follow: true } : undefined,
    alternates: { canonical: '/products' }
  }
}

export default function ProductsPage({ searchParams }: { searchParams: Record<string,string|undefined> }){
  const initial = {
    q: searchParams.q ?? '',
    heat: (searchParams.heat as any) ?? 'Any',
    cat: searchParams.cat ?? 'All Categories'
  };
  return <ProductsClient initial={initial} catalog={catalog} />;
}
