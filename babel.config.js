// need to compile node_modules (eg: vue-runtime-helps)
module.exports = (api) => {
  api.cache(false);
  return {
    presets: [
      [
        '@babel/preset-env',
        {
          modules: false,
        },
      ],
      '@babel/preset-typescript',
    ],
    plugins: ['@vue/babel-plugin-jsx'],
    env: {
      test: {
        plugins: ['@vue/babel-plugin-jsx'],
        presets: [
          [
            '@babel/preset-env',
            {
              targets: {
                node: 'current',
              },
            },
          ],
          '@babel/preset-typescript',
        ],
      },
    },
  };
};
