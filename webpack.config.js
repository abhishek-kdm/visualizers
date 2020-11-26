/* eslint disable-next-line */
const { resolve } = require('path');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');

const src = (p) => resolve(__dirname, 'src', p);

module.exports = (env) => ({
  entry: [src('index.ts'), src('style.css')],
  output: {
    path: resolve(__dirname, 'public'),
    filename: env.production ? '[name].[contenthash].js' : '[name].js'
  },
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.ts$/,
        loader: 'awesome-typescript-loader'
      },
      {
        exclude: /node_modules/,
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: env.production ? 'style.[contenthash].css' : 'style.css'
    }),
    new CssMinimizerPlugin(),
    new HTMLWebpackPlugin({
      template: src('index.html'),
      inject: true
    }),
  ],
  resolve: { extensions: ['.js', '.ts'] }
});

