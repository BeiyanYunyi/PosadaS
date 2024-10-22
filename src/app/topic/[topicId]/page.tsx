import db from '@/app/utils/database';
import { topicList } from '@drizzle/schema/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import type { DiscussionForumPosting, WithContext } from 'schema-dts';
import Reply from './Reply';

export const generateStaticParams = async () => {
  const topics = await db.query.topicList.findMany({ columns: { topicId: true } });
  return topics.map((item) => ({ topicId: item.topicId }));
};

// export const runtime = process.env.VERCEL ? 'edge' : 'nodejs';

const Page = async (props: { params: Promise<{ topicId: string }> }) => {
  const { params } = props;
  const { topicId } = await params;
  const topic = await db.query.topicList.findFirst({
    where: eq(topicList.topicId, topicId),
    with: {
      replies: true,
    },
  });
  if (!topic) notFound();

  const jsonLd: WithContext<DiscussionForumPosting> = {
    '@context': 'https://schema.org',
    '@type': 'DiscussionForumPosting',
    headline: topic.title!,
    text: topic.content!.replace(/<[^>]+>/g, ''),
    author: {
      '@type': 'Person',
      name: topic.authorName!,
      url: `https://www.douban.com/people/${topic.authorId}`,
    },
    url: `${process.env.SERVE_URL}/topic/${topic.topicId}`,
    datePublished: new Date(Number(topic.createTime) * 1000).toISOString(),
    commentCount: topic.replies.length,
    comment: topic.replies.map((item) => ({
      '@context': 'https://schema.org',
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
  return (
    <>
      {topic.replies.map((item) => (
        <Reply key={item.replyId} reply={item} isAuthor={topic.authorId === item.authorId} />
      ))}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
};

export default Page;
