import AppLink from '@/app/components/AppLink';
import prisma from '@/app/utils/database';
import processHTML from '@/app/utils/processHTML';
import { css } from '@styles/css';
import Image from 'next/image';
import Link from 'next/link';

export const generateStaticParams = async () => {
  const topics = await prisma.topicList.findMany({ select: { topicID: true } });
  return topics.map((item) => ({ topicID: item.topicID }));
};

const Page = async ({ params }: { params: { topicID: string } }) => {
  const [topic, contents] = await Promise.all([
    prisma.topicList.findUnique({ where: { topicID: params.topicID } }),
    prisma.reply.findMany({ where: { topicID: params.topicID }, orderBy: { replyTime: 'asc' } }),
  ]);
  if (!topic) return <div>404</div>;
  return (
    <main className="">
      <article>
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
          <AppLink href={`https://www.douban.com/people/${topic.authorID}`}>
            {topic.authorName}
          </AppLink>
          <span
            className={css({
              mx: '1rem',
            })}
          >
            {new Date(Number(topic.createTime!) * 1000).toLocaleString()}
          </span>
        </h4>
        <section dangerouslySetInnerHTML={{ __html: processHTML(topic.content!) }} />
      </article>
      {contents.map((item) => (
        <article key={item.replyID}>
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
            <AppLink href={`https://www.douban.com/people/${item.authorID}`}>
              {item.authorName}
            </AppLink>
            <span
              className={css({
                mx: '1rem',
              })}
            >
              {new Date(Number(item.replyTime!) * 1000).toLocaleString()}
            </span>
          </h4>
          {item.quoting && (
            <section
              className={css({
                borderLeft: '2px solid #ddd',
                my: '20px',
                pl: '7px',
                position: 'relative',
                width: '30em',
                fontSize: '0.875rem',
                color: '#666',
              })}
            >
              {item.quotingText}
              <AppLink
                href={`https://www.douban.com/people/${item.quotingAuthorID}`}
                className={css({ ml: '0.625rem' })}
              >
                {item.quotingAuthorName}
              </AppLink>
            </section>
          )}
          {item.image && (
            <Link
              href={item.image}
              className={css({ display: 'block', position: 'relative', h: '30rem', w: '30rem' })}
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
          <section
            className={css({ mb: '1.5rem' })}
            dangerouslySetInnerHTML={{ __html: processHTML(item.content!) }}
          />
        </article>
      ))}
    </main>
  );
};

export default Page;
