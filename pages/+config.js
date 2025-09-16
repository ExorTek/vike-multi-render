import vikeReact from 'vike-react/config';
import { MainLayout } from '@layouts';
import { onRenderHtml, onRenderClient } from '@renderer';

export default {
  onRenderHtml,
  onRenderClient,
  Layout: MainLayout,
  reactStrictMode: process.env.NODE_ENV === 'development',
  favicon: '/favicon.ico',
  prerender: {
    partial: false, // Set to true to allow only some pages to be pre-rendered without warnings; requires a production server for non-prerendered pages
    noExtraDir: true, // When true, generates files like /about.html instead of /about/index.html
    parallel: true, // Controls concurrent pre-rendering (true uses all CPU cores, false/1 disables concurrency, or set a specific number)
    disableAutoRun: false, // When true, prevents automatic pre-rendering during build command, allowing manual triggering
    keepDistServer: false, // When true, retains the dist/server/ directory after pre-rendering completes
    enable: true,
    redirects: true, // When true, enables pre-rendering of redirect pages
  },
  extends: [vikeReact],
};
