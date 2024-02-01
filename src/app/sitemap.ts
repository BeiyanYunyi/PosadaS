import { topicList } from '@drizzle/schema/schema';
import { desc } from 'drizzle-orm';
import { MetadataRoute } from 'next';
import { db } from './utils/database';

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const topics = await db.query.topicList.findMany({
    columns: { topicId: true, lastReplyTime: true },
    orderBy: desc(topicList.lastReplyTime),
  });
  return topics.map((topic) => ({
    url: `${process.env.SERVE_URL}/topic/${topic.topicId}`,
  }));
};

export default sitemap;
