const webpack = require('webpack');
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

let entry = {};
let plugins = [
  new CleanWebpackPlugin(['dist']),
  new webpack.ProvidePlugin({
    $: 'jquery',
    jQuery: 'jquery'
  }),
  new FaviconsWebpackPlugin({
    logo: './src/img/favicon.png',
    prefix: '/icons-[hash]/',
    inject: true,
    persistentCache: true,
    title: 'My App Title',
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
  new MiniCssExtractPlugin({
    filename: 'css/[name]-[contenthash:4].css',
    chunkFilename: '[id].css'
  })
];

function addPage (path) {
  let name = path.split('/').slice(-1)[0];
  let i = 2;
  while (name in entry) {
    name = `${name}${i}`;
    i++;
  }
  plugins.push(
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
