import { readFile } from 'node:fs/promises';
import type { FontStyle } from 'next/dist/compiled/@vercel/og/satori';
import { cache } from 'react';

const getFonts = cache(async () => {
  if (process.env.VERCEL) return undefined;
  const font = await readFile(
    './src/app/topic/[topicId]/MapleMono-SC-NF-Regular.ttf',
  );
  return [
    { data: font, name: 'Maple Mono SC NF', style: 'normal' as FontStyle },
  ];
});

export default getFonts;
