import typescript from 'rollup-plugin-typescript2';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import fs from 'fs';
import path from 'path';

const localePath = path.resolve(__dirname, 'lib/locale');
const fileList = fs.readdirSync(localePath);

const plugins = [
  nodeResolve(),
  typescript({
    useTsconfigDeclarationDir: true,
    tsconfig: 'tsconfig.locale.json',
  }),
];

export function camelcase(str) {
  const camelizeRE = /-(\w)/g;
  return str.replace(camelizeRE, (_, c) => (c ? c.toUpperCase() : ''));
}

const config = fileList.map((file) => {
  const input = path.join(localePath, file);
  const external = ['vue-datepicker-next'];
  const filename = path.basename(file, '.ts');
  return {
    input,
    plugins,
    external,
    output: [
      {
        file: `locale/${filename}.js`,
        format: 'umd',
        name: `DatePicker.lang.${camelcase(filename)}`,
        globals: {
          'vue-datepicker-next': 'DatePicker',
        },
      },
      {
        file: `locale/${filename}.es.js`,
        format: 'esm',
        exports: 'named',
      },
    ],
  };
});

export default config;
