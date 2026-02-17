import { MetadataRoute } from 'next';

/**
 * Robots.txt Generator
 * 
 * Rules for search engine crawlers.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/dashboard/',         // Admin dashboard
        '/sellers/dashboard/', // Seller dashboard
        '/api/',               // Internal API routes
        '/onboarding/',        // Private flow
        '/cart/',              // Conversion page
        '/checkout/',          // Conversion page
      ],
    },
    sitemap: 'https://artisanal-refuge.vercel.app/sitemap.xml',
  };
}
