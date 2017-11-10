let config = {
    name: 'rollup-plugin-markdown',
    exports: 'default',
    input: './index.js',
    output: {
      file: 'build/markdown.js',
      format: 'umd'
    }
};

export default config;
