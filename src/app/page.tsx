import db from '@/app/utils/database';
import { topicList } from '@drizzle/schema/schema';
import { css } from '@styles/css';
import { desc } from 'drizzle-orm';
import AppLink from './components/AppLink';
import Random from './components/Random';
import TopicList from './components/TopicList';

const Home = async () => {
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
    orderBy: desc(topicList.lastReplyTime),
    limit: 100,
  });
  return (
    <>
      <Random />
      <TopicList content={content} />
      <div
        className={css({
          display: 'flex',
          justifyContent: 'end',
          w: 'full',
          color: '#666',
          whiteSpace: 'pre-wrap',
        })}
      >
        {'> '}
        <AppLink href="/page/2">更多小组讨论</AppLink>
      </div>
    </>
  );
};

export default Home;
