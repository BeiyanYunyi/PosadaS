import { notFound, redirect } from 'next/navigation';
import db from '@/app/utils/database';

export const generateMetadata = async (props: {
  params: Promise<{ topicId: string; replyId: string }>;
}) => {
  const params = await props.params;
  const topic = await db.query.topicList.findFirst({
    where: { topicId: params.topicId },
    columns: { title: true, content: true },
    with: { replies: { where: { replyId: params.replyId } } },
  });
  if (!topic) notFound();
  return {
    title: `回复：${topic.title}`,
    description: topic.replies[0].content?.replace(/<[^>]+>/g, '') || '',
  };
};

const TopicReply = async (props: {
  params: Promise<{ topicId: string; replyId: string }>;
}) => {
  const params = await props.params;
  return redirect(`/topic/${params.topicId}#${params.replyId}`);
};

export default TopicReply;
