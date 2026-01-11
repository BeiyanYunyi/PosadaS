import { css } from '@styles/css';
import Image from 'next/image';
import Link from 'next/link';
import { type FC, Suspense } from 'react';
import getImgURL from '../utils/imgUtil';
import ErrorBoundary from './ErrorBoundary';

const containerCls = css({
  display: 'block',
  position: 'relative',
  h: '30rem',
  w: 'full',
  lg: {
    w: '30rem',
  },
});

const AppImageInner: FC<{ src: string }> = async ({ src }) => {
  const rSrc = await getImgURL(src);
  return (
    <Link
      target="_blank"
      rel="noopener noreferrer"
      href={rSrc}
      className={containerCls}
    >
      <Image
        fill
        alt={rSrc}
        className={css({ objectFit: 'contain' })}
        src={rSrc}
      />
    </Link>
  );
};

const AppImage: FC<{ src: string }> = ({ src }) => (
  <ErrorBoundary
    fallback={<div className={containerCls}>Error loading image {src}</div>}
  >
    <Suspense fallback={<div className={containerCls}>Loading...</div>}>
      <AppImageInner src={src} />
    </Suspense>
  </ErrorBoundary>
);

export default AppImage;
