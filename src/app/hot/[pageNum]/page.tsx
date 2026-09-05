import { reply, topicList } from '@drizzle/schema/schema';
import { asc, count as dbCount, desc, eq, sql, sum } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import AppLink from '@/app/components/AppLink';
import DiscussionTabs from '@/app/components/DiscussionTabs';
import TopicList from '@/app/components/TopicList';
import db from '@/app/utils/database';

const pageSize = 100;

const getPageCount = async () =>
  Math.ceil(
    (await db.select({ value: dbCount() }).from(topicList))[0].value / pageSize,
  );

export const generateStaticParams = async () => {
  const count = await getPageCount();
  return Array.from({ length: Math.max(1, count) }, (_, i) => ({
    pageNum: String(i + 1),
  }));
};

const Page = async (props: { params: Promise<{ pageNum: string }> }) => {
  const { pageNum } = await props.params;
  const page = Number(pageNum);
  if (!/^[1-9]\d*$/.test(pageNum) || !Number.isSafeInteger(page)) notFound();

  // Main posts and comments are both stored in reply, so sum all their votes.
  const topicVotes = db
    .select({
      topicId: reply.topicId,
      votes: sum(reply.votes).as('votes'),
    })
    .from(reply)
    .groupBy(reply.topicId)
    .as('topic_votes');

  const content = await db
    .select({
      totalCount: sql`count(*) over ()`.mapWith(Number),
      title: topicList.title,
      topicId: topicList.topicId,
      lastReplyTime: topicList.lastReplyTime,
      isElite: topicList.isElite,
      deleteTime: topicList.deleteTime,
      authorName: topicList.authorName,
      reply: topicList.reply,
      authorId: topicList.authorId,
    })
    .from(topicList)
    .leftJoin(topicVotes, eq(topicList.topicId, topicVotes.topicId))
    .orderBy(
      desc(sql`coalesce(${topicVotes.votes}, 0)`),
      sql`${topicList.lastReplyTime} desc nulls last`,
      asc(topicList.topicId),
    )
    .limit(pageSize)
    .offset((page - 1) * pageSize);

  if (page > 1 && content.length === 0) notFound();
  const count = Math.ceil((content[0]?.totalCount ?? 0) / pageSize);

  return (
    <>
      <DiscussionTabs active="hot" />
      <TopicList content={content} />
      <div>
        {Array.from({ length: count }, (_, i) => i + 1).map((item) => (
          <AppLink href={`/hot/${item}`} key={item} activated={page === item}>
            {item}
          </AppLink>
        ))}
      </div>
    </>
  );
};

export default Page;
