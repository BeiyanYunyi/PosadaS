import Link from 'next/link';
import prisma from '../utils/database';
import Loading from './Loading';

const Random = async () => {
  const count = await prisma.topicList.count();
  const target = await prisma.topicList.findMany({
    select: { topicID: true },
    skip: Math.floor(Math.random() * count),
    take: 1,
  });
  return (
    <Link href={`/topic/${target[0].topicID}`}>
      <Loading />
    </Link>
  );
};

export default Random;
