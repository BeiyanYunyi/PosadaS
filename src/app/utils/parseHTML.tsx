import { css } from '@styles/css';
import parse, { Element } from 'html-react-parser';
import Image from 'next/image';
import Link from 'next/link';

const parseHTML = (html: string) =>
  parse(html, {
    replace: (node) => {
      if (node instanceof Element && node.name === 'img') {
        return (
          <Link
            target="_blank"
            rel="noopener noreferrer"
            href={node.attribs.src}
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
              alt={node.attribs.src}
              className={css({ objectFit: 'contain' })}
              src={node.attribs.src}
              referrerPolicy="no-referrer"
            />
          </Link>
        );
      }
      return node;
    },
  });

export default parseHTML;
