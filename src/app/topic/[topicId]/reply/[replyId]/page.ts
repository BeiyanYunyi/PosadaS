import db from '@/app/utils/database';
import { reply, topicList } from '@drizzle/schema/schema';
import { eq } from 'drizzle-orm';
import { notFound, redirect } from 'next/navigation';

export const generateMetadata = async (
  props: {
    params: Promise<{ topicId: string; replyId: string }>;
  }
) => {
  const params = await props.params;
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

const TopicReply = async (props: { params: Promise<{ topicId: string; replyId: string }> }) => {
  const params = await props.params;
  return redirect(`/topic/${params.topicId}#${params.replyId}`);
};

export default TopicReply;
