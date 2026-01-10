/* eslint-disable react/jsx-props-no-spreading */
import type { SVGProps } from 'react';

const ReplyIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    {...props}
  >
    <title>Reply Icon</title>
    <path
      fill="currentColor"
      d="m6 18l-2.3 2.3q-.475.475-1.088.213T2 19.575V4q0-.825.588-1.413T4 2h16q.825 0 1.413.588T22 4v12q0 .825-.588 1.413T20 18H6Zm-.85-2H20V4H4v13.125L5.15 16ZM4 16V4v12Z"
    />
  </svg>
);

export default ReplyIcon;
