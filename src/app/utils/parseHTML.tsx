import parse, { Element } from 'html-react-parser';
import AppImage from '../components/AppImage';

const parseHTML = (html: string) =>
  parse(html, {
    replace: (node) => {
      if (node instanceof Element && node.name === 'img') {
        return <AppImage src={node.attribs.src} />;
      }
      return node;
    },
  });

export default parseHTML;
