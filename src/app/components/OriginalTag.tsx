import { css } from '@styles/css';
import type { FC } from 'react';

const OriginalTag: FC = () => (
  <span
    className={css({
      borderWidth: '1px',
      borderBlockStyle: 'solid',
      borderColor: 'blue.400',
      borderRadius: '2px',
      color: 'blue.400',
      display: 'inline-block',
      fontSize: '12px',
      lineHeight: '18px',
      mr: '4px',
      padding: '1px 3px',
    })}
  >
    站内
  </span>
);

export default OriginalTag;
