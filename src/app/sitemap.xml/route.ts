import { generateSitemaps } from '@/app/topic/sitemap';

export const dynamic = 'force-dynamic';

export const GET = async () => {
  const sitemaps = await generateSitemaps();
  const entries = sitemaps.map(({ id }) => {
    const url = new URL(`/topic/sitemap/${id}.xml`, process.env.SERVE_URL).href;
    const location = url.replaceAll('&', '&amp;').replaceAll('<', '&lt;');
    return `<sitemap><loc>${location}</loc></sitemap>`;
  });

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries.join('')}</sitemapindex>`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } },
  );
};
