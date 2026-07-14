const path = require('path');

module.exports = {
  entry: './source/scripts/index.js',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist/'),
    library: {
      type: 'module'
    }
  },
  experiments: {
    outputModule: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ]
  },
  mode: 'production',
};
