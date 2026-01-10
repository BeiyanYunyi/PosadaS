import { css } from '@styles/css';
import type { FC } from 'react';

const DeletedTag: FC = () => (
  <span
    className={css({
      borderWidth: '1px',
      borderBlockStyle: 'solid',
      borderColor: 'yellow.600',
      background: 'yellow.300',
      borderRadius: '2px',
      color: 'stone.700',
      display: 'inline-block',
      fontSize: '12px',
      lineHeight: '18px',
      mr: '4px',
      padding: '1px 3px',
    })}
  >
    已删
  </span>
);

export default DeletedTag;
