import { topicList } from '@drizzle/schema/schema';
import { count as dbCount, eq } from 'drizzle-orm';
import AppLink from '@/app/components/AppLink';
import DiscussionTabs from '@/app/components/DiscussionTabs';
import TopicList from '@/app/components/TopicList';
import db from '@/app/utils/database';

const getPageCount = async () =>
  Math.round(
    (
      await db
        .select({ value: dbCount() })
        .from(topicList)
        .where(eq(topicList.isElite, true))
    )[0].value / 100,
  );

export const generateStaticParams = async () => {
  const count = await getPageCount();
  return Array.from({ length: count }, (_, i) => i + 1).map((item) => ({
    pageNum: item.toString(),
  }));
};

const Page = async (props: { params: Promise<{ pageNum: string }> }) => {
  const { params } = props;
  const { pageNum } = await params;
  const content = await db.query.topicList.findMany({
    columns: {
      title: true,
      topicId: true,
      lastReplyTime: true,
      isElite: true,
      deleteTime: true,
      authorName: true,
      reply: true,
      authorId: true,
    },
    where: { isElite: true },
    orderBy: { lastReplyTime: 'desc' },
    limit: 100,
    offset: (Number(pageNum) - 1) * 100,
  });
  const count = await getPageCount();
  return (
    <>
      <DiscussionTabs active="elite" />
      <TopicList content={content} />
      <div>
        {Array.from({ length: count }, (_, i) => i + 1).map((item) => (
          <AppLink
            href={`/elite/${item}`}
            key={item}
            activated={Number(pageNum) === item}
          >
            {item}
          </AppLink>
        ))}
      </div>
    </>
  );
};

export default Page;
