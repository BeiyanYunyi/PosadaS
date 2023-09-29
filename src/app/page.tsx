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
  </>
);

export default Home;
