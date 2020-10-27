import autoprefixer from 'autoprefixer';
import dotenv from 'dotenv';
import ForkTSCheckerPlugin from 'fork-ts-checker-webpack-plugin';
import HTMLPlugin from 'html-webpack-plugin';
import MiniCSSExtractPlugin from 'mini-css-extract-plugin';
import OptimzeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import path from 'path';
import RemovePlugin from 'remove-files-webpack-plugin';
import ScriptExtHTMLPlugin from 'script-ext-html-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import { Configuration } from 'webpack';
import { Configuration as WDSConfiguration } from 'webpack-dev-server';

dotenv.config();

const devMode = process.env.NODE_ENV === 'development';

const resolve = (...dirs: string[]) => path.resolve(__dirname, devMode ? '../..' : '..', ...dirs);

const entrypoints: {
  chunk: string;
  entry: string;
  output: string;
  title?: string;
  publicPath?: RegExp;
}[] = [
  {
    chunk: 'main',
    entry: resolve('src/index.tsx'),
    output: 'index.html',
    title: 'hello world',
    publicPath: /^\/$/g,
  },
];

export default <Configuration>{
  mode: devMode ? 'development' : 'production',
  entry: entrypoints.reduce(
    (obj, item) => ((obj[item.chunk] = resolve(item.entry)), obj),
    {} as Record<string, string>
  ),
  output: {
    filename: devMode ? '[name].js' : '[name].[contenthash].js',
    chunkFilename: devMode ? '[name].js' : '[name].[contenthash].js',
    path: resolve('dist'),
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    alias: {
      react: 'preact/compat',
      'react-dom/test-utils': 'preact/test-utils',
      'react-dom': 'preact/compat',
    },
  },
  stats: devMode
    ? {
        all: false,
        assets: true,
        cached: true,
        colors: true,
        hash: true,
        builtAt: true,
        timings: true,
        errors: true,
        errorDetails: true,
        logging: 'info',
        warnings: true,
        version: true,
        context: resolve('src'),
      }
    : { preset: 'normal' },
  devtool: devMode ? 'eval-cheap-module-source-map' : 'source-map',
  devServer: {
    historyApiFallback: {
      rewrites: entrypoints.map(item => ({
        from: item.publicPath ?? new RegExp(`^/${item.chunk}$`),
        to: '/' + item.output,
      })),
    },
    host: '0.0.0.0',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
    },
    public: `http://localhost:${process.env.PORT}`,
    contentBase: [resolve('public'), resolve('dist')],
    stats: module.exports.stats,
  } as WDSConfiguration,
  plugins: [
    new RemovePlugin({
      before: {
        exclude: [resolve('dist/tsconfig.tsbuildinfo')],
        include: [resolve('dist')],
        logDebug: false,
        log: false,
        logWarning: false,
        logError: true,
      },
      watch: { beforeForFirstBuild: true },
    }),
    new ForkTSCheckerPlugin({
      eslint: {
        enabled: true,
        files: resolve('src/**/*.{ts,tsx,js,jsx}'),
      },
      logger: {
        devServer: devMode,
        infrastructure: 'silent',
        issues: 'console',
      },
    }),
    new ScriptExtHTMLPlugin({ defaultAttribute: 'defer' }),
    ...entrypoints.map(
      item =>
        new HTMLPlugin({
          template: resolve('./src/template.ejs'),
          filename: item.output,
          chunks: [item.chunk],
          title: item.title,
        })
    ),
    ...(devMode
      ? []
      : [
          new MiniCSSExtractPlugin({
            filename: devMode ? '[name].css' : '[name].[contenthash].css',
            chunkFilename: devMode ? '[name].css' : '[name].[contenthash].css',
            esModule: true,
          }),
          new OptimzeCSSAssetsPlugin(),
        ]),
  ],
  optimization: devMode
    ? {
        runtimeChunk: 'single',
        minimize: false,
        removeAvailableModules: false,
        removeEmptyChunks: false,
        splitChunks: false,
      }
    : {
        minimize: true,
        minimizer: [
          new TerserPlugin({
            test: /\.(j|t)sx?$/i,
            extractComments: false,
          }),
        ],
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            gamelib: {
              test: /[\\/]node_modules[\\/](pixi-js|@pixi\/.+)[\\/]/,
              chunks: 'all',
              priority: 5,
            },
          },
        },
      },
  module: {
    rules: [
      { test: /\.(jpe?g|png|gif|mp3|ttf|eot|woff)$/i, loader: 'file-loader' },
      { test: /\.jsx?$/i, enforce: 'pre', loader: 'source-map-loader' },
      { test: /\.tsx?$/i, loader: 'ts-loader' },
      {
        test: /\.(s[ac]|c)ss$/i,
        use: [
          devMode ? 'style-loader' : MiniCSSExtractPlugin.loader,
          { loader: 'css-loader', options: { sourceMap: true } },
          {
            loader: 'postcss-loader',
            options: { sourceMap: true, postcssOptions: { plugins: [autoprefixer()] } },
          },
          {
            loader: 'sass-loader',
            options: { sourceMap: true, implementation: require('dart-sass') },
          },
        ],
      },
    ],
  },
};
