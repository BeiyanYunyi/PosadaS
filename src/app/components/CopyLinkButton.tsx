'use client';

import type {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  FC,
  ReactNode,
} from 'react';

const CopyLinkButton: FC<
  { children: ReactNode; link: string } & DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >
> = ({ children, link, ...props }) => (
  <button
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props}
    type="button"
    onClick={() => {
      navigator.clipboard.writeText(link);
    }}
  >
    {children}
  </button>
);

export default CopyLinkButton;
