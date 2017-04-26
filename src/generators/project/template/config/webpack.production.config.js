const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const OccurrenceOrderPlugin = require('webpack/lib/optimize/OccurrenceOrderPlugin')
const UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin')
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const rootPath = path.resolve(__dirname, '..')
const distPath = path.resolve(rootPath, './dist')
const basePath = path.resolve(rootPath, './src')
const imagesPath = path.resolve(basePath, './assets/images')
const componentsPath = path.resolve(basePath, './components')
const layoutsPath = path.resolve(basePath, './layouts')
const modulesPath = path.resolve(basePath, './modules')

module.exports = {
  devtool: 'source-map',
  entry: './src/main.js',

  output: {
    path: distPath,
    filename: 'js/app.js',
    publicPath: '/'
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new OccurrenceOrderPlugin(true),
    new ExtractTextPlugin({
      filename: 'css/styles.css',
      allChunks: true
    }),
    new UglifyJsPlugin({
      compressor: {
        screw_ie8: true,
        warnings: false
      },
      mangle: {
        screw_ie8: true
      },
      output: {
        comments: false,
        screw_ie8: true
      },
      sourceMap: false
    }),
    new HtmlWebpackPlugin({
      inject: 'head',
      title: 'PROJECT_NAME',
      template: path.resolve(basePath, './index.html')
    }),
    new ScriptExtHtmlWebpackPlugin({
      defaultAttribute: 'async'
    }),
    new CopyWebpackPlugin([
      { from: `${rootPath}/assets`, to: 'assets/' }
    ])
  ],

  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        options: {
          failOnWarning: false,
          failOnError: true
        }
      },
      {
        test: /\.json$/,
        exclude: /node_modules/,
        loader: 'json'
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        loader: ExtractTextPlugin.extract(require('./postcss.config.js'))
      },
      {
        test: /\.css$/,
        include: /node_modules/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader'
        })
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        loader: ExtractTextPlugin.extract(require('./postcss.config.js'))
      },
      {
        test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000&mimetype=application/font-woff&name=[name].[hash].[ext]'
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000&mimetype=application/octet-stream&name=[name].[hash].[ext]'
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file?name=[name].[hash].[ext]'
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000&mimetype=image/svg+xml&name=[name].[hash].[ext]'
      },
      {
        test: /\.(jpg|png)$/,
        loader: 'file?name=[name].[hash].[ext]',
        include: imagesPath
      }
    ]
  },

  resolve: {
    extensions: ['.js', '.jsx', '.css'],
    alias: {
      'images': imagesPath,
      'components': componentsPath,
      'layouts': layoutsPath,
      'modules': modulesPath
    }
  }
}
