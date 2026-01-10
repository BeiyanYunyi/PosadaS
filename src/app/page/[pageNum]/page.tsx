import { topicList } from '@drizzle/schema/schema';
import { count as dbCount } from 'drizzle-orm';
import AppLink from '@/app/components/AppLink';
import TopicList from '@/app/components/TopicList';
import db from '@/app/utils/database';

export const generateStaticParams = async () => {
  const count = Math.round(
    (await db.select({ value: dbCount() }).from(topicList))[0].value / 100,
  );
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
    orderBy: { lastReplyTime: 'desc' },
    limit: 100,
    offset: (Number(pageNum) - 1) * 100,
  });
  const count = Math.round(
    (await db.select({ value: dbCount() }).from(topicList))[0].value / 100,
  );
  return (
    <>
      <TopicList content={content} />
      <div>
        {Array.from({ length: count }, (_, i) => i + 1).map((item) => (
          <AppLink
            href={`/page/${item}`}
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
