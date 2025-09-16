import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';
import vike from 'vike/plugin';
import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [vike(), react(), tailwindcss()],
  resolve: {
    alias: {
      '@': resolve(__dirname),
      '@components': resolve(__dirname, 'components'),
      '@constants': resolve(__dirname, 'constants'),
      '@helpers': resolve(__dirname, 'helpers'),
      '@hooks': resolve(__dirname, 'hooks'),
      '@layouts': resolve(__dirname, 'layouts'),
      '@lib': resolve(__dirname, 'lib'),
      '@pages': resolve(__dirname, 'pages'),
      '@providers': resolve(__dirname, 'providers'),
      '@renderer': resolve(__dirname, 'renderer'),
      '@services': resolve(__dirname, 'services'),
      '@store': resolve(__dirname, 'store'),
      '@styles': resolve(__dirname, 'styles'),
    },
  },
  build: {
    target: 'esnext',
    minify: 'esbuild',
  },
});
