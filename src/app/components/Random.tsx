import prisma from '../utils/database';
import AppLink from './AppLink';

const Random = async () => {
  const count = await prisma.topicList.count();
  const target = await prisma.topicList.findMany({
    select: { topicID: true },
    skip: Math.floor(Math.random() * count),
    take: 1,
  });
  return <AppLink href={`/topic/${target[0].topicID}`}>随便看看</AppLink>;
};

export default Random;
