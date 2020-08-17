const path = require('path');
const typescript = require('rollup-plugin-typescript2');
const replace = require('rollup-plugin-replace');

const version = process.env.VERSION || require(path.resolve(__dirname, '../package.json')).version;

const commons = {
  banner: `/**
  * vue-adaptive-utils v${version}
  * (c) ${new Date().getFullYear()} Abdelrahman Awad
  * @license MIT
  */`
};

const formatMap = {
  es: 'esm',
  umd: ''
};

function createConfig(format) {
  const tsPlugin = typescript({
    tsconfig: path.resolve(__dirname, '../tsconfig.json'),
    cacheRoot: path.resolve(__dirname, '../node_modules/.rts2_cache'),
    tsconfigOverride: {
      exclude: ['**/tests']
    }
  });

  const config = {
    input: {
      input: path.resolve(__dirname, `../src/index.ts`),
      external: ['vue'],
      plugins: [tsPlugin, replace({ __VERSION__: version })]
    },
    output: {
      banner: commons.banner,
      format,
      name: format === 'umd' ? 'VueAdaptiveUtils' : undefined,
      globals: {
        vue: 'Vue'
      }
    }
  };

  config.bundleName = `vue-adaptive-utils${formatMap[format] ? '.' + formatMap[format] : ''}.js`;

  // if (options.env) {
  //   config.input.plugins.unshift(
  //     replace({
  //       'process.env.NODE_ENV': JSON.stringify(options.env)
  //     })
  //   );
  // }

  return config;
}

module.exports = {
  formatMap,
  createConfig
};
