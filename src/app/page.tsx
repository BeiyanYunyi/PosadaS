import { css } from '@styles/css';
import prisma from './utils/database';
import Client from './client';
import AppLink from './components/AppLink';
import Loading from './components/Loading';

const content = await prisma.topicList.findMany({
  select: { title: true, topicID: true, lastReplyTime: true },
  orderBy: { lastReplyTime: 'desc' },
});

export default async function Home() {
  return (
    <main
      className={css({
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem',
        lg: { padding: '6rem' },
        minHeight: '100vh',
        fontFamily: 'sans',
      })}
    >
      <Loading />
      <Client />
      <ul>
        {content.map((item) => (
          <li
            key={item.topicID}
            className={css({
              display: 'flex',
              flexDirection: 'column',
              lg: { flexDirection: 'row' },
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
            })}
          >
            <AppLink
              href={`/topic/${item.topicID}`}
              className={css({
                _hover: { color: 'white', background: '#37a' },
                _visited: { color: '#666699' },
                color: '#37a',
              })}
            >
              {item.title}
            </AppLink>
            <time
              className={css({
                color: '#999',
              })}
            >
              {new Date(Number(item.lastReplyTime!) * 1000).toLocaleString()}
            </time>
          </li>
        ))}
      </ul>
    </main>
  );
}
