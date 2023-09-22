import { css } from '@styles/css';
import './globals.css';

export const metadata = {
  title: '影之避难所',
  description: '永不陷落的波派',
};

export default ({ children }: { children: React.ReactNode }) => (
  <html lang="en" className={css({ maxW: '1280px', mx: 'auto', overflowX: 'hidden' })}>
    <body className={css({ fontFamily: 'mono' })}>
      {children}
      <footer
        className={css({
          mt: '40px',
          py: '6px',
          color: '#999',
          borderTop: '1px dashed #ddd',
          fontSize: '0.8125rem',
        })}
      >
        {' '}
        © 2020－2023 Posadas Group, all rights <strong>reversed</strong> 阿根廷波萨达斯科技有限公司
      </footer>
    </body>
  </html>
);
