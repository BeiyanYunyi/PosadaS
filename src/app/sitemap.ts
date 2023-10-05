import { MetadataRoute } from 'next';
import prisma from './utils/database';

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const topics = await prisma.topicList.findMany({
    select: { topicID: true, lastReplyTime: true },
    orderBy: { lastReplyTime: 'desc' },
  });
  return topics.map((topic) => ({
    url: `${process.env.SERVE_URL}/topic/${topic.topicID}`,
    lastModified: topic.lastReplyTime ? new Date(Number(topic.lastReplyTime) * 1000) : new Date(),
    changeFrequency: 'weekly',
  }));
};

export default sitemap;
