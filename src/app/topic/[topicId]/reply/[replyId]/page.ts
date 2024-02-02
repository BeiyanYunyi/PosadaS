import { redirect } from 'next/navigation';

const TopicReply = ({ params }: { params: { topicId: string; replyId: string } }) =>
  redirect(`/topic/${params.topicId}#${params.replyId}`);

export default TopicReply;
