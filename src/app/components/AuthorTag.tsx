import { css } from '@styles/css';
import type { FC } from 'react';

const AuthorTag: FC = () => (
  <span
    className={css({
      borderWidth: '1px',
      borderBlockStyle: 'solid',
      borderColor: 'green.400',
      background: 'transparent',
      borderRadius: '2px',
      color: 'green.400',
      display: 'inline-block',
      fontSize: '12px',
      lineHeight: '18px',
      ml: '4px',
      padding: '1px 3px',
    })}
  >
    楼主
  </span>
);

export default AuthorTag;
