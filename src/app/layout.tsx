import { css } from '@styles/css';
import './globals.css';
import GitHubIcon from './components/GitHubIcon';
import Link from 'next/link';
import AppLink from './components/AppLink';

export const metadata = {
  title: '影之避难所',
  description: '永不陷落的波派',
  metadataBase: new URL(process.env.SERVE_URL || ''),
};

export default ({ children }: { children: React.ReactNode }) => (
  <html lang="en" className={css({ maxW: '1280px', mx: 'auto', overflowX: 'hidden' })}>
    <body className={css({ fontFamily: 'mono' })}>
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
        © 2020－2023 Posadas Group, all rights <strong>reversed</strong> 阿根廷波萨达斯科技有限公司
        <br />
        备份于豆瓣小组“后启示录地下避难所” · 内容版权归原作者所有 · 代码以 AGPL 协议
        <AppLink href="https://github.com/BeiyanYunyi/PosadaS">开源</AppLink> ·{' '}
        <Link href="https://github.com/BeiyanYunyi/PosadaS" className={css({ display: 'inline' })}>
          <GitHubIcon className={css({ display: 'inline' })} />
        </Link>
      </footer>
    </body>
  </html>
);
