const locale: Intl.LocalesArgument = 'zh-CN';
const options: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
};

const localeArgs = [locale, options] as const;

export default localeArgs;
