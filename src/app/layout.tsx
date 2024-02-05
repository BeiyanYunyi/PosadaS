import { css } from '@styles/css';
import { CurrentYear } from 'foxact/current-year';
import Link from 'next/link';
import AppLink from './components/AppLink';
import GitHubIcon from './components/GitHubIcon';
import './globals.css';

export const metadata = {
  title: '影之避难所',
  description: '永不陷落的波派',
  metadataBase: new URL(process.env.SERVE_URL || ''),
};

export default ({ children }: { children: React.ReactNode }) => (
  <html lang="en" className={css({ maxW: '1280px', mx: 'auto', overflowX: 'hidden' })}>
    <body className={css({ fontFamily: 'sans' })}>
      <main
        className={css({
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1rem',
          lg: { padding: '6rem' },
          minHeight: '100vh',
        })}
      >
        {children}
      </main>
      <footer
        className={css({
          mt: '40px',
          py: '6px',
          px: '0.5rem',
          color: '#999',
          borderTop: '1px dashed #ddd',
          fontSize: '0.8125rem',
        })}
      >
        © 2020－
        <CurrentYear defaultYear={new Date().getFullYear()} />{' '}
        <AppLink href="https://band.us/band/86180635">Posadas Group</AppLink>, all rights{' '}
        <strong>reversed</strong> 贴吧-豆瓣-
        <AppLink href="https://band.us/band/86180635">BAND 波萨达斯学派</AppLink>
        <br />
        备份于豆瓣小组“后启示录地下避难所” · 内容若存在版权，归原作者所有 · 代码以 AGPL 协议
        <AppLink href="https://github.com/BeiyanYunyi/PosadaS">开源</AppLink> ·{' '}
        <Link href="https://github.com/BeiyanYunyi/PosadaS" className={css({ display: 'inline' })}>
          <GitHubIcon className={css({ display: 'inline' })} />
        </Link>
      </footer>
    </body>
  </html>
);
