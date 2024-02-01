import AppLink from '@/app/components/AppLink';
import DeletedTag from '@/app/components/DeletedTag';
import EliteTag from '@/app/components/EliteTag';
import Loading from '@/app/components/Loading';
import OriginalTag from '@/app/components/OriginalTag';
import Random from '@/app/components/Random';
import { db } from '@/app/utils/database';
import isUUID from '@/app/utils/isUUID';
import localeArgs from '@/app/utils/localeArgs';
import parseHTML from '@/app/utils/parseHTML';
import { reply as dbReply, topicList } from '@drizzle/schema/schema';
import { css } from '@styles/css';
import { asc, eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { FC, Suspense } from 'react';
import type { DiscussionForumPosting, WithContext } from 'schema-dts';
import Reply from './Reply';
import { h4Class } from './styles';

// export const generateStaticParams = async () => {
//   const topics = await db.query.topicList.findMany({ columns: { topicId: true } });
//   return topics.map((item) => ({ topicId: item.topicId }));
// };

export const generateMetadata = async ({ params }: { params: { topicId: string } }) => {
  const topic = await db.query.topicList.findFirst({
    where: eq(topicList.topicId, params.topicId),
    columns: { title: true, content: true },
  });
  if (!topic) notFound();
  return {
    title: topic.title,
    description: topic.content?.replace(/<[^>]+>/g, ''),
  };
};

const articleClass = css({ w: 'full', flexGrow: 1 });
const h1Class = css({
  mt: '1rem',
  fontSize: '1.625rem',
  color: '#494949',
  fontWeight: 'bold',
  p: '0 0 15px 0',
  lineHeight: '1.1',
});

const Replies: FC<{
  topicId: string;
  authorId: string | null;
}> = async ({ topicId, authorId }) => {
  const contents = await db.query.reply.findMany({
    where: eq(dbReply.topicId, topicId),
    orderBy: asc(dbReply.replyTime),
  });
  return (
    <>
      {contents.map((item) => (
        <Reply key={item.replyId} reply={item} isAuthor={authorId === item.authorId} />
      ))}
    </>
  );
};

const Page = async ({ params }: { params: { topicId: string } }) => {
  const topic = await db.query.topicList.findFirst({
    where: eq(topicList.topicId, params.topicId),
    with: { replies: { columns: { replyId: true } } },
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
    comment: { '@id': `${process.env.SERVE_URL}/api/replies/${topic.topicId}` },
  };
  return (
    <>
      <Random />
      <article className={articleClass}>
        <section>
          <h1 className={h1Class}>{topic.title}</h1>
          <h4 className={h4Class}>
            {topic.isElite && <EliteTag />}
            {isUUID(topic.topicId) && <OriginalTag />}
            {!isUUID(topic.topicId) && !!topic.deleteTime && <DeletedTag />}
            <AppLink href={`https://www.douban.com/people/${topic.authorId}`}>
              {topic.authorName}
            </AppLink>
            <span
              className={css({
                mx: '1rem',
              })}
            >
              {new Date(Number(topic.createTime!) * 1000).toLocaleString(...localeArgs)}
            </span>
          </h4>
          <div className={css({ mb: '1.5rem' })}>{parseHTML(topic.content!)}</div>
          <Suspense fallback={<Loading />}>
            <Replies topicId={params.topicId} authorId={topic.authorId} />
          </Suspense>
        </section>
      </article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
};

export default Page;
