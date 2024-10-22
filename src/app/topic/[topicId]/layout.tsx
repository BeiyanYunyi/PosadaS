import AppLink from '@/app/components/AppLink';
import DeletedTag from '@/app/components/DeletedTag';
import EliteTag from '@/app/components/EliteTag';
import OriginalTag from '@/app/components/OriginalTag';
import Random from '@/app/components/Random';
import db from '@/app/utils/database';
import isUUID from '@/app/utils/isUUID';
import localeArgs from '@/app/utils/localeArgs';
import parseHTML from '@/app/utils/parseHTML';
import { topicList } from '@drizzle/schema/schema';
import { css } from '@styles/css';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { FC, ReactNode } from 'react';
import { h4Class } from './styles';

export const generateMetadata = async (props: { params: Promise<{ topicId: string }> }) => {
  const params = await props.params;
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

const TopicLayout: FC<{
  children: ReactNode;
  params: Promise<{ topicId: string }>;
}> = async (props) => {
  const { params } = props;
  const { topicId } = await params;

  const { children } = props;

  const topic = await db.query.topicList.findFirst({
    where: eq(topicList.topicId, topicId),
  });
  if (!topic) notFound();

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
        </section>
        {children}
      </article>
    </>
  );
};

export default TopicLayout;
