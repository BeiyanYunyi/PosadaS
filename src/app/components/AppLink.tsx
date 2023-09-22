/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-props-no-spreading */
import { css } from '@styles/css';
import clsx from 'clsx';
import Link from 'next/link';
import { FC } from 'react';

const AppLink: FC<React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }> = (props) => {
  const { className: outerClass, ...otherProp } = props;
  return (
    <Link
      {...otherProp}
      className={clsx(
        outerClass,
        css({
          color: '#37a',
          _hover: { color: 'white', background: '#37a' },
        }),
      )}
    >
      {otherProp.children}
    </Link>
  );
};
export default AppLink;
