import AppLink from '@/app/components/AppLink';
import DeletedTag from '@/app/components/DeletedTag';
import EliteTag from '@/app/components/EliteTag';
import OriginalTag from '@/app/components/OriginalTag';
import isUUID from '@/app/utils/isUUID';
import { css } from '@styles/css';
import clsx from 'clsx';
import { FC } from 'react';
import localeArgs from '../utils/localeArgs';
import ReplyIcon from './ReplyIcon';

const liStyle = css({
  display: 'grid',
  gridAutoFlow: 'row dense',
  gridTemplateColumns: '1fr 2fr',
  lg: { gridTemplateColumns: '8fr 2fr 0.5fr 2fr' },
  justifyContent: 'space-between',
  position: 'relative',
  my: '4px',
  _after: {
    bottom: '-2px',
    position: 'absolute',
    content: '""',
    width: '100%',
    margin: '0 auto',
    left: '0',
    borderBottom: '2px dashed #eee',
  },
});

const thStyle = css({ color: '#666' });

const TopicList: FC<{
  content: {
    title: string | null;
    authorID: string | null;
    authorName: string | null;
    reply: number | null;
    lastReplyTime: bigint | null;
    topicID: string;
    isElite: boolean | null;
    deleteTime: bigint | null;
  }[];
}> = ({ content }) => (
  <ul className={css({ w: '100%' })}>
    <li className={clsx(liStyle, css({ display: 'none', lg: { display: 'grid' } }))}>
      <span className={thStyle}>讨论</span>
      <span className={thStyle}>作者</span>
      <span className={thStyle}>回应</span>
      <span className={clsx(thStyle, css({ textAlign: 'center' }))}>最后回应</span>
    </li>
    {content.map((item) => (
      <li key={item.topicID} className={liStyle}>
        <div className={css({ gridColumn: 2, lg: { gridColumn: 1 } })}>
          {item.isElite && <EliteTag />}
          {isUUID(item.topicID) && <OriginalTag />}
          {!isUUID(item.topicID) && !!item.deleteTime && <DeletedTag />}
          <AppLink href={`/topic/${item.topicID}`}>{item.title}</AppLink>
        </div>
        <div className={css({ gridColumn: 2, lg: { gridColumn: 1 } })}>
          <AppLink href={`https://www.douban.com/people/${item.authorID}`}>
            {item.authorName}
          </AppLink>
        </div>
        <p className={clsx(thStyle, css({ fontSize: '0.9rem', lg: { fontSize: '1rem' } }))}>
          <ReplyIcon
            className={css({
              w: '16px',
              h: '16px',
              display: 'inline-block',
              mr: '0.2rem',
              lg: { display: 'none', mr: '0' },
            })}
          />
          {item.reply}
        </p>
        <time
          className={clsx(
            thStyle,
            css({ fontSize: '0.9rem', textAlign: 'end', lg: { fontSize: '1rem' } }),
          )}
        >
          {new Date(Number(item.lastReplyTime!) * 1000).toLocaleString(...localeArgs)}
        </time>
      </li>
    ))}
  </ul>
);

export default TopicList;
