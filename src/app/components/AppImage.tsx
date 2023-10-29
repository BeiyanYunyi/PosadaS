import { css } from '@styles/css';
import Image from 'next/image';
import Link from 'next/link';
import { FC } from 'react';
import getImgURL from '../utils/imgUtil';

const AppImage: FC<{ src: string }> = async ({ src }) => {
  const rSrc = await getImgURL(src);
  return (
    <Link
      target="_blank"
      rel="noopener noreferrer"
      href={rSrc}
      className={css({
        display: 'block',
        position: 'relative',
        h: '30rem',
        w: 'full',
        lg: {
          w: '30rem',
        },
      })}
    >
      <Image
        fill
        alt={rSrc}
        className={css({ objectFit: 'contain' })}
        src={rSrc}
        referrerPolicy="no-referrer"
      />
    </Link>
  );
};

export default AppImage;
