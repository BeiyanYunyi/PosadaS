import AppImage from '@/app/components/AppImage';
import AppLink from '@/app/components/AppLink';
import AuthorTag from '@/app/components/AuthorTag';
import OriginalTag from '@/app/components/OriginalTag';
import isUUID from '@/app/utils/isUUID';
import localeArgs from '@/app/utils/localeArgs';
import parseHTML from '@/app/utils/parseHTML';
import { css } from '@styles/css';
import { FC } from 'react';
import { h4Class } from './styles';

const quotingClass = css({
  borderLeft: '2px solid #ddd',
  my: '20px',
  pl: '7px',
  position: 'relative',
  fontSize: '0.875rem',
  color: '#666',
  lg: { w: '30rem' },
  whiteSpace: 'pre-wrap',
});

const Reply: FC<{
  reply: {
    replyId: string;
    topicId: string | null;
    authorId: string | null;
    authorName: string | null;
    isPoster: boolean | null;
    replyTime: number | null;
    content: string | null;
    image: string | null;
    quoting: boolean | null;
    quotingImage: string | null;
    quotingText: string | null;
    quotingAuthorId: string | null;
    quotingAuthorName: string | null;
    votes: number | null;
  };
  isAuthor: boolean;
}> = ({ reply, isAuthor }) => (
  <section key={reply.replyId} id={reply.replyId} className={css({ mb: '0.5rem' })}>
    <h4 className={h4Class}>
      {isUUID(reply.replyId) && <OriginalTag />}
      <AppLink href={`https://www.douban.com/people/${reply.authorId}`}>{reply.authorName}</AppLink>
      {isAuthor && <AuthorTag />}
      <span
        className={css({
          mx: '1rem',
        })}
      >
        {new Date(Number(reply.replyTime!) * 1000).toLocaleString(...localeArgs)}
      </span>
    </h4>
    {reply.quoting && (
      <div className={quotingClass}>
        {reply.quotingText && parseHTML(reply.quotingText)}
        <AppLink
          href={`https://www.douban.com/people/${reply.quotingAuthorId}`}
          className={css({ ml: '0.625rem' })}
        >
          {reply.quotingAuthorName}
        </AppLink>
      </div>
    )}
    {reply.image && <AppImage src={reply.image} />}
    <div className={css({ mb: '0.5rem', whiteSpace: 'pre-wrap' })}>{parseHTML(reply.content!)}</div>
    <div className={css({ fontSize: '0.875rem', color: '#aaa', textAlign: 'right' })}>
      赞 {!!reply.votes && <>({reply.votes})</>}
    </div>
  </section>
);

export default Reply;
