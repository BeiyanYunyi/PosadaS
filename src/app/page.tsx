import { css } from '@styles/css';
import { readFile } from 'node:fs/promises';
import Client from './client';
import Loading from './components/Loading';

const content = await readFile('package.json', 'utf-8');
export default async function Home() {
  return (
    <main
      className={css({
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '6rem',
        minHeight: '100vh',
      })}
    >
      <Loading />
      <Client content={content} />
    </main>
  );
}
