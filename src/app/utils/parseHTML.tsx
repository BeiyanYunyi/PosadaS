import parse, {
  type DOMNode,
  Element,
  type HTMLReactParserOptions,
  domToReact,
} from 'html-react-parser';
import AppImage from '../components/AppImage';
import AppLink from '../components/AppLink';

const options: HTMLReactParserOptions = {
  replace: (node) => {
    if (node instanceof Element && node.name === 'img') {
      return <AppImage src={node.attribs.src} />;
    }
    if (node instanceof Element && node.name === 'a') {
      return (
        <AppLink
          href={node.attribs.href}
          target="_blank"
          referrerPolicy="no-referrer"
        >
          {domToReact(node.children as DOMNode[], options)}
        </AppLink>
      );
    }
    return node;
  },
};

const parseHTML = (html: string) => parse(html, options);

export default parseHTML;
