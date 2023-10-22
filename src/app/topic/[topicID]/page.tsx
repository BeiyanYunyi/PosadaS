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
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

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

const Page = async ({ params }: { params: { topicID: string } }) => {
  const [topic, contents] = await Promise.all([
    prisma.topicList.findUnique({ where: { topicID: params.topicID } }),
    prisma.reply.findMany({ where: { topicID: params.topicID }, orderBy: { replyTime: 'asc' } }),
  ]);
  if (!topic) notFound();
  return (
    <>
      <Random />
      <article className={css({ w: 'full' })}>
        <section>
          <h1
            className={css({
              mt: '1rem',
              fontSize: '1.625rem',
              color: '#494949',
              fontWeight: 'bold',
              p: '0 0 15px 0',
              lineHeight: '1.1',
            })}
          >
            {topic.title}
          </h1>
          <h4
            className={css({
              fontStyle: 'inherit',
              backgroundColor: '#f0f6f3',
              color: '#666',
              fontSize: '0.8125rem',
              lineHeight: '1.25rem',
              mb: '1rem',
            })}
          >
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
          <section key={item.replyID} id={item.replyID} className={css({ mb: '0.5rem' })}>
            <h4
              className={css({
                fontStyle: 'inherit',
                backgroundColor: '#f0f6f3',
                color: '#666',
                fontSize: '0.8125rem',
                lineHeight: '1.25rem',
                mb: '1rem',
              })}
            >
              {isUUID(item.replyID) && <OriginalTag />}
              <AppLink href={`https://www.douban.com/people/${item.authorID}`}>
                {item.authorName}
              </AppLink>
              <span
                className={css({
                  mx: '1rem',
                })}
              >
                {new Date(Number(item.replyTime!) * 1000).toLocaleString(...localeArgs)}
              </span>
            </h4>
            {item.quoting && (
              <div
                className={css({
                  borderLeft: '2px solid #ddd',
                  my: '20px',
                  pl: '7px',
                  position: 'relative',
                  fontSize: '0.875rem',
                  color: '#666',
                  lg: { w: '30rem' },
                  whiteSpace: 'pre-wrap',
                })}
              >
                {item.quotingText}
                <AppLink
                  href={`https://www.douban.com/people/${item.quotingAuthorID}`}
                  className={css({ ml: '0.625rem' })}
                >
                  {item.quotingAuthorName}
                </AppLink>
              </div>
            )}
            {item.image && (
              <Link
                referrerPolicy="no-referrer"
                href={item.image}
                className={css({
                  display: 'block',
                  position: 'relative',
                  h: '30rem',
                  w: 'full',
                  lg: {
                    w: '30rem',
                  },
                })}
              >
                <Image
                  className={css({ objectFit: 'contain' })}
                  fill
                  referrerPolicy="no-referrer"
                  alt="reply"
                  src={item.image}
                />
              </Link>
            )}
            <div className={css({ mb: '0.5rem', whiteSpace: 'pre-wrap' })}>
              {parseHTML(item.content!)}
            </div>
            <div className={css({ fontSize: '0.875rem', color: '#aaa', textAlign: 'right' })}>
              赞 {!!item.votes && <>({item.votes})</>}
            </div>
          </section>
        ))}
      </article>
    </>
  );
};

export default Page;
