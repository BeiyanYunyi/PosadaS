import { topicList } from '@drizzle/schema/schema';
import { count } from 'drizzle-orm';
import db from '@/app/utils/database';
import AppLink from './AppLink';

const Random = async () => {
  const counts = (await db.select({ value: count() }).from(topicList))[0].value;
  const target = await db.query.topicList.findMany({
    columns: { topicId: true },
    offset: Math.floor(Math.random() * counts),
    limit: 1,
  });
  return <AppLink href={`/topic/${target[0].topicId}`}>随便看看</AppLink>;
};

export default Random;
