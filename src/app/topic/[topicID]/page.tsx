import AppLink from '@/app/components/AppLink';
import DeletedTag from '@/app/components/DeletedTag';
import EliteTag from '@/app/components/EliteTag';
import Loading from '@/app/components/Loading';
import OriginalTag from '@/app/components/OriginalTag';
import Random from '@/app/components/Random';
import prisma from '@/app/utils/database';
import isUUID from '@/app/utils/isUUID';
import localeArgs from '@/app/utils/localeArgs';
import parseHTML from '@/app/utils/parseHTML';
import { css } from '@styles/css';
import { notFound } from 'next/navigation';
import { FC, Suspense } from 'react';
import Reply from './Reply';
import { h4Class } from './styles';

// export const generateStaticParams = async () => {
//   const topics = await prisma.topicList.findMany({ select: { topicID: true } });
//   return topics.map((item) => ({ topicID: item.topicID }));
// };

export const generateMetadata = async ({ params }: { params: { topicID: string } }) => {
  const topic = await prisma.topicList.findUnique({
    where: { topicID: params.topicID },
    select: { title: true, content: true },
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

const Replies: FC<{ topicID: string; authorID: string | null }> = async ({ topicID, authorID }) => {
  const contents = await prisma.reply.findMany({
    where: { topicID },
    orderBy: { replyTime: 'asc' },
  });
  return (
    <>
      {contents.map((item) => (
        <Reply key={item.replyID} reply={item} isAuthor={authorID === item.authorID} />
      ))}
    </>
  );
};

const Page = async ({ params }: { params: { topicID: string } }) => {
  const topic = await prisma.topicList.findUnique({ where: { topicID: params.topicID } });
  if (!topic) notFound();
  return (
    <>
      <Random />
      <article className={articleClass}>
        <section>
          <h1 className={h1Class}>{topic.title}</h1>
          <h4 className={h4Class}>
            {topic.isElite && <EliteTag />}
            {isUUID(topic.topicID) && <OriginalTag />}
            {!isUUID(topic.topicID) && !!topic.deleteTime && <DeletedTag />}
            <AppLink href={`https://www.douban.com/people/${topic.authorID}`}>
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
            <Replies topicID={params.topicID} authorID={topic.authorID} />
          </Suspense>
        </section>
      </article>
    </>
  );
};

export default Page;
