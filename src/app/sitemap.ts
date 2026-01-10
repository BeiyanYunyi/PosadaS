import type { MetadataRoute } from 'next';
import db from '@/app/utils/database';

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const topics = await db.query.topicList.findMany({
    columns: { topicId: true, lastReplyTime: true },
    orderBy: { lastReplyTime: 'desc' },
  });
  return topics.map((topic) => ({
    url: `${process.env.SERVE_URL}/topic/${topic.topicId}`,
  }));
};

export default sitemap;
