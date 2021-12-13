import { defineConfig, UserConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import svgLoader from 'vite-svg-loader';
import path from 'path';

// https://vitejs.dev/config/
const baseConfig: UserConfig = {
  plugins: [vue(), vueJsx({ mergeProps: false }), svgLoader()],
  resolve: {
    alias: {
      'vue-datepicker-next': path.resolve(__dirname, './lib'),
    },
  },
};

const externalDependencies = (id: string) => !id.startsWith('.') && !id.startsWith('/');

const esConfig: UserConfig = {
  build: {
    outDir: '.',
    minify: false,
    target: 'es2015',
    emptyOutDir: false,
    lib: {
      entry: path.resolve(__dirname, 'lib/index.ts'),
      name: 'DatePicker',
      formats: ['es'],
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      external: externalDependencies,
    },
  },
};

const umdConfig: UserConfig = {
  build: {
    outDir: '.',
    minify: 'esbuild',
    target: 'es2015',
    emptyOutDir: false,
    lib: {
      entry: path.resolve(__dirname, 'lib/index.ts'),
      name: 'DatePicker',
      formats: ['umd'],
      fileName: () => `index.js`,
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
};

export default defineConfig(({ command }) => {
  if (command === 'serve') {
    return baseConfig;
  }
  const format = process.env.LIB_FORMAT;
  if (format === 'es') {
    return { ...baseConfig, ...esConfig };
  }
  return { ...baseConfig, ...umdConfig };
});
