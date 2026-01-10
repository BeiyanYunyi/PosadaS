import { css } from '@styles/css';
import type { FC } from 'react';

const EliteTag: FC = () => (
  <span
    className={css({
      backgroundColor: '#f04d68',
      border: '1px solid rgba(0,0,0,.1)',
      borderRadius: '2px',
      color: '#fff',
      display: 'inline-block',
      fontSize: '12px',
      lineHeight: '18px',
      mr: '4px',
      padding: '1px 3px',
    })}
  >
    精华
  </span>
);

export default EliteTag;
