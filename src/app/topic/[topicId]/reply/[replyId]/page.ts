import db from '@/app/utils/database';
import { reply, topicList } from '@drizzle/schema/schema';
import { eq } from 'drizzle-orm';
import { notFound, redirect } from 'next/navigation';

export const generateMetadata = async ({
  params,
}: {
  params: { topicId: string; replyId: string };
}) => {
  const topic = await db.query.topicList.findFirst({
    where: eq(topicList.topicId, params.topicId),
    columns: { title: true, content: true },
    with: { replies: { where: eq(reply.replyId, params.replyId) } },
  });
  if (!topic) notFound();
  return {
    title: `回复：${topic.title}`,
    description: topic.replies[0].content?.replace(/<[^>]+>/g, '') || '',
  };
};

const TopicReply = ({ params }: { params: { topicId: string; replyId: string } }) =>
  redirect(`/topic/${params.topicId}#${params.replyId}`);

export default TopicReply;
