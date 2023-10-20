import { css } from '@styles/css';
import AppLink from './components/AppLink';
import Random from './components/Random';
import TopicList from './components/TopicList';
import prisma from './utils/database';

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
});

const Home = () => (
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

export default Home;
