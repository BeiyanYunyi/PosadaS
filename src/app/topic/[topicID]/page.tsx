import AppLink from '@/app/components/AppLink';
import DeletedTag from '@/app/components/DeletedTag';
import EliteTag from '@/app/components/EliteTag';
import OriginalTag from '@/app/components/OriginalTag';
import Random from '@/app/components/Random';
import prisma from '@/app/utils/database';
import isUUID from '@/app/utils/isUUID';
import localeArgs from '@/app/utils/localeArgs';
import parseHTML from '@/app/utils/parseHTML';
import { css } from '@styles/css';
import { notFound } from 'next/navigation';
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

const articleClass = css({ w: 'full' });
const h1Class = css({
  mt: '1rem',
  fontSize: '1.625rem',
  color: '#494949',
  fontWeight: 'bold',
  p: '0 0 15px 0',
  lineHeight: '1.1',
});

const Page = async ({ params }: { params: { topicID: string } }) => {
  const [topic, contents] = await Promise.all([
    prisma.topicList.findUnique({ where: { topicID: params.topicID } }),
    prisma.reply.findMany({ where: { topicID: params.topicID }, orderBy: { replyTime: 'asc' } }),
  ]);
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
        </section>
        {contents.map((item) => (
          <Reply key={item.replyID} reply={item} isAuthor={topic.authorID === item.authorID} />
        ))}
      </article>
    </>
  );
};

export default Page;
