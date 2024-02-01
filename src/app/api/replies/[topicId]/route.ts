import { db } from '@/app/utils/database';
import { reply } from '@drizzle/schema/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import type { Collection, WithContext } from 'schema-dts';

export const GET = async (_request: Request, { params }: { params: { topicId: string } }) => {
  const { topicId } = params;
  const query = await db.query.reply.findMany({
    where: eq(reply.topicId, topicId),
    columns: { content: true, authorName: true, authorId: true, replyTime: true, replyId: true },
  });
  if (!query) notFound();
  const res: WithContext<Collection> = {
    '@context': 'https://schema.org',
    '@type': 'Collection',
    collectionSize: query.length,
    comment: query.map((item) => ({
      '@id': `${process.env.SERVE_URL}/api/reply/${item.replyId}`,
      '@type': 'Comment',
      author: {
        '@type': 'Person',
        name: item.authorName!,
        url: `https://www.douban.com/people/${item.authorId}`,
      },
      text: item.content!.replace(/<[^>]+>/g, ''),
      datePublished: new Date(item.replyTime! * 1000).toISOString(),
    })),
  };
  return new Response(JSON.stringify(res), {
    // Although some file's extension is .webp, Douban doesn't serve webp actually. All of them are jpg.
    headers: { 'Content-Type': 'application/ld+json' },
  });
};
