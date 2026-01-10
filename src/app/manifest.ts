import type { MetadataRoute } from 'next';
import { metadata } from './layout';

const manifest = (): MetadataRoute.Manifest => ({
  name: metadata.title,
  short_name: metadata.title,
  description: metadata.description,
  start_url: '/',
  display: 'standalone',
  background_color: '#fff',
  theme_color: '#000',
  icons: [
    { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
  ],
});

export default manifest;
