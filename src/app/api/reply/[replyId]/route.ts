import { db } from '@/app/utils/database';
import { reply } from '@drizzle/schema/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import type { Comment, WithContext } from 'schema-dts';

export const GET = async (_request: Request, { params }: { params: { replyId: string } }) => {
  const { replyId } = params;
  const query = await db.query.reply.findFirst({
    where: eq(reply.replyId, replyId),
    columns: { content: true, authorName: true, authorId: true, replyTime: true },
  });
  if (!query) notFound();
  const res: WithContext<Comment> = {
    '@context': 'https://schema.org',
    '@type': 'Comment',
    '@id': `${process.env.SERVE_URL}/api/reply/${replyId}`,
    author: {
      '@type': 'Person',
      name: query.authorName!,
      url: `https://www.douban.com/people/${query.authorId}`,
    },
    text: query.content!.replace(/<[^>]+>/g, ''),
    datePublished: new Date(query.replyTime! * 1000).toISOString(),
  };
  return new Response(JSON.stringify(res), {
    // Although some file's extension is .webp, Douban doesn't serve webp actually. All of them are jpg.
    headers: { 'Content-Type': 'application/ld+json' },
  });
};
