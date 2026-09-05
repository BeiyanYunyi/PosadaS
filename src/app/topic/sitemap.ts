import { topicList } from '@drizzle/schema/schema';
import { count } from 'drizzle-orm';
import type { MetadataRoute } from 'next';
import { notFound } from 'next/navigation';
import db from '@/app/utils/database';

const PAGE_SIZE = 1_000;

export const generateSitemaps = async () => {
  const [{ total }] = await db.select({ total: count() }).from(topicList);
  return Array.from(
    { length: Math.max(1, Math.ceil(total / PAGE_SIZE)) },
    (_, id) => ({
      id,
    }),
  );
};

const sitemap = async ({
  id,
}: {
  id: Promise<string>;
}): Promise<MetadataRoute.Sitemap> => {
  const pageId = await id;
  const page = Number(pageId);
  if (!/^\d+$/.test(pageId) || !Number.isSafeInteger(page * PAGE_SIZE)) {
    notFound();
  }

  const topics = await db.query.topicList.findMany({
    columns: { topicId: true },
    orderBy: { topicId: 'asc' },
    limit: PAGE_SIZE,
    offset: page * PAGE_SIZE,
  });
  return topics.map((topic) => ({
    url: `${process.env.SERVE_URL}/topic/${topic.topicId}`,
  }));
};

export default sitemap;
