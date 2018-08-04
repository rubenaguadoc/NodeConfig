const webpack = require('webpack');
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const workboxPlugin = require('workbox-webpack-plugin');

let entry = {};
let plugins = [
  new CleanWebpackPlugin(['dist']),
  new webpack.ProvidePlugin({
    $: 'jquery',
    jQuery: 'jquery'
  }),
  new MiniCssExtractPlugin({
    filename: 'css/[name]-[contenthash:4].css',
    chunkFilename: '[id].css'
  }),
  new FaviconsWebpackPlugin({
    logo: './src/img/favicon.png',
    prefix: '/img/icons/',
    title: 'My App Title',
    inject: true,
    persistentCache: true,
    icons: {
      android: true,
      appleIcon: false,
      appleStartup: false,
      coast: false,
      favicons: true,
      firefox: true,
      opengraph: false,
      twitter: false,
      yandex: false,
      windows: false
    }
  }),
  new WebpackPwaManifest({
    name: 'App Name',
    short_name: 'Short',
    description: 'Description',
    theme_color: '#21f3c7',
    background_color: '#f4f4f4',
    display: 'standalone',
    orientation: 'portrait',
    start_url: '/index.html',
    lang: 'es-ES',
    Scope: '/',
    inject: true,
    fingerprints: true,
    ios: false,
    publicPath: '.',
    includeDirectory: true,
    icons: [
      {
        src: path.resolve('src/img/favicon.png'),
        sizes: [72, 96, 128, 144, 152, 192, 256, 384, 512],
        destination: path.join('img', 'icons')
      }
    ]
  }),
  new workboxPlugin.InjectManifest({
    swSrc: './src/sw/sw.js',
    swDest: 'sw.js',
    exclude: [/.*\/icons\/.*/, /^manifest\..*\.json$/],
    precacheManifestFilename: 'precache-[manifestHash].js'
    // clientsClaim: true,
    // skipWaiting: true,
    // importsDirectory: 'sw',
    // directoryIndex: 'index.html',
    // cacheId: 'my-app',
    // runtimeCaching: []
  })
];

function addPage (path) {
  let name = path.split('/').slice(-1)[0];
  let i = 2;
  while (name in entry) {
    name = `${name}${i}`;
    i++;
  }
  plugins.unshift(
    new HtmlWebpackPlugin({
      inject: true,
      minify: true,
      filename: `${path}.html`,
      template: `src/${path}.html`,
      chunks: [name]
    })
  );
  entry[name] = [
    'babel-polyfill',
    `./src/js/${name}.js`
  ];
}

addPage('index');
// addPage('subPath/page');
// addPage('subPath/other/index');

module.exports = {
  entry: entry,
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name]-[contenthash:4].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['env', 'stage-0']
        }
      },
      {
        test: /\.scss$|\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: 'css/'
            }
          },
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.html$/,
        use: [
          'htmllint-loader',
          'html-loader'
        ]
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name]-[hash:4].[ext]',
            outputPath: 'img/',
            publicPath: 'img/'
          }
        }
      }
    ]
  },
  plugins: plugins,
  devServer: {
    contentBase: path.resolve(__dirname, 'dist')
    // https: true
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        parallel: true,
        uglifyOptions: {
          mangle: true,
          ie8: true,
          safari10: true
        }
      }),
      new OptimizeCSSAssetsPlugin()
    ]
  }
};
