module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: 'defaults and supports es6-module',
        useBuiltIns: 'usage',
        corejs: 3,
        modules: false,
      },
    ],
  ],
};
