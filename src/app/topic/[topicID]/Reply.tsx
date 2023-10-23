import AppLink from '@/app/components/AppLink';
import AuthorTag from '@/app/components/AuthorTag';
import OriginalTag from '@/app/components/OriginalTag';
import isUUID from '@/app/utils/isUUID';
import localeArgs from '@/app/utils/localeArgs';
import parseHTML from '@/app/utils/parseHTML';
import { css } from '@styles/css';
import Image from 'next/image';
import Link from 'next/link';
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
const imgContainerClass = css({
  display: 'block',
  position: 'relative',
  h: '30rem',
  w: 'full',
  lg: {
    w: '30rem',
  },
});

const Reply: FC<{
  reply: {
    replyID: string;
    topicID: string | null;
    authorID: string | null;
    authorName: string | null;
    isPoster: boolean | null;
    replyTime: bigint | null;
    content: string | null;
    image: string | null;
    quoting: boolean | null;
    quotingImage: string | null;
    quotingText: string | null;
    quotingAuthorID: string | null;
    quotingAuthorName: string | null;
    votes: number | null;
  };
  isAuthor: boolean;
}> = ({ reply, isAuthor }) => (
  <section key={reply.replyID} id={reply.replyID} className={css({ mb: '0.5rem' })}>
    <h4 className={h4Class}>
      {isUUID(reply.replyID) && <OriginalTag />}
      <AppLink href={`https://www.douban.com/people/${reply.authorID}`}>{reply.authorName}</AppLink>
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
        {reply.quotingText}
        <AppLink
          href={`https://www.douban.com/people/${reply.quotingAuthorID}`}
          className={css({ ml: '0.625rem' })}
        >
          {reply.quotingAuthorName}
        </AppLink>
      </div>
    )}
    {reply.image && (
      <Link
        rel="noopener noreferrer"
        target="_blank"
        href={reply.image}
        className={imgContainerClass}
      >
        <Image
          className={css({ objectFit: 'contain' })}
          fill
          referrerPolicy="no-referrer"
          alt="reply"
          src={reply.image}
        />
      </Link>
    )}
    <div className={css({ mb: '0.5rem', whiteSpace: 'pre-wrap' })}>{parseHTML(reply.content!)}</div>
    <div className={css({ fontSize: '0.875rem', color: '#aaa', textAlign: 'right' })}>
      赞 {!!reply.votes && <>({reply.votes})</>}
    </div>
  </section>
);

export default Reply;
