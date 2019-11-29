const { resolve } = require('path');

module.exports = (env) => ({
  entry: resolve(__dirname, 'src', 'index.ts'),
  output: {
    path: resolve(__dirname, 'dist'),
    filename: env.production ? '[name].[chunkhash].js' : '[name].js'
  },
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.ts$/,
        loader: 'awesome-typescript-loader'
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.ts']
  }
});

