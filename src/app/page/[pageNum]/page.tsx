import AppLink from '@/app/components/AppLink';
import TopicList from '@/app/components/TopicList';
import prisma from '@/app/utils/database';

export const generateStaticParams = async () => {
  const count = Math.round((await prisma.topicList.count()) / 100);
  return Array.from({ length: count }, (_, i) => i + 1);
};

const Page = async ({ params }: { params: { pageNum: string } }) => {
  const content = await prisma.topicList.findMany({
    select: {
      title: true,
      topicID: true,
      lastReplyTime: true,
      isElite: true,
      deleteTime: true,
      authorName: true,
      reply: true,
      authorID: true,
    },
    orderBy: { lastReplyTime: 'desc' },
    take: 100,
    skip: (Number(params.pageNum) - 1) * 100,
  });
  const count = Math.round((await prisma.topicList.count()) / 100);
  return (
    <>
      <TopicList content={content} />
      <div>
        {Array.from({ length: count }, (_, i) => i + 1).map((item) => (
          <AppLink href={`/page/${item}`} key={item}>
            {item}
          </AppLink>
        ))}
      </div>
    </>
  );
};

export default Page;
