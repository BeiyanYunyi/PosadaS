/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-props-no-spreading */
import { css } from '@styles/css';
import clsx from 'clsx';
import Link from 'next/link';
import { FC } from 'react';

const AppLink: FC<
  // eslint-disable-next-line react/require-default-props
  React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; activated?: boolean }
> = (props) => {
  const { className: outerClass, activated, ...otherProp } = props;
  return (
    <Link
      {...otherProp}
      className={clsx(
        outerClass,
        css({
          color: activated ? 'white' : '#37a',
          background: activated ? '#83BF73' : undefined,
          _hover: {
            color: activated ? '37a' : 'white',
            background: activated ? undefined : '#37a',
          },
        }),
      )}
    >
      {otherProp.children}
    </Link>
  );
};

export default AppLink;
