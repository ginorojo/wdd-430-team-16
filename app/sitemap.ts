import { MetadataRoute } from 'next';
import { prisma } from '@/app/lib/prisma';

/**
 * Sitemap Generator
 * 
 * Automatically generates a sitemap for search engines.
 * Includes static pages and dynamic product/artisan pages.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://wdd-430-team-16.vercel.app';

  // 1. Fetch dynamic data from database
  const [products, sellers] = await Promise.all([
    prisma.product.findMany({ select: { id: true, updatedAt: true } }),
    prisma.seller.findMany({ select: { id: true, updatedAt: true } }),
  ]);

  // 2. Map products to sitemap entries
  const productEntries = products.map((p) => ({
    url: `${baseUrl}/product/${p.id}`,
    lastModified: p.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // 3. Map sellers to sitemap entries
  const sellerEntries = sellers.map((s) => ({
    url: `${baseUrl}/sellers/${s.id}`,
    lastModified: s.updatedAt,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // 4. Define static pages
  const staticPages = [
    '',
    '/about',
    '/artisans',
    '/sellers',
    '/login',
    '/signup',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1.0 : 0.6,
  }));

  return [...staticPages, ...productEntries, ...sellerEntries];
}
