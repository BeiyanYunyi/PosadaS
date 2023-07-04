import './globals.css';
import { Inter } from 'next/font/google';
import { css } from '@styles/css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: '影之避难所',
  description: '永不陷落的波派',
};

export default ({ children }: { children: React.ReactNode }) => (
  <html lang="en" className={css({ maxW: '100vw', overflowX: 'hidden' })}>
    <body className={inter.className}>{children}</body>
  </html>
);
