import { load } from 'cheerio';

const processHTML = (htmlStr: string): TrustedHTML => {
  const html = load(htmlStr, {}, false);
  html('img').attr('referrerPolicy', 'no-referrer');
  return html.html();
};

export default processHTML;
