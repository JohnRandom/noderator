const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const OccurrenceOrderPlugin = require('webpack/lib/optimize/OccurrenceOrderPlugin')
const DedupePlugin = require('webpack/lib/optimize/DedupePlugin')
const UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin')
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin')

const buildPath = path.resolve(__dirname, './build')
const basePath = path.resolve(__dirname, './src')
const imagesPath = path.resolve(basePath, './assets/images')
const componentsPath = path.resolve(basePath, './components')
const layoutsPath = path.resolve(basePath, './layouts')
const modulesPath = path.resolve(basePath, './modules')

module.exports = {
  devtool: 'source-map',
  entry: './src/main',

  output: {
    path: buildPath,
    filename: 'app.js',
    publicPath: '/'
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new OccurrenceOrderPlugin(true),
    new DedupePlugin(),
    new ExtractTextPlugin('style.css', {allChunks: true}),
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
      }
    }),
    new HtmlWebpackPlugin({
      inject: 'head',
      template: path.resolve(basePath, './index.html')
    }),
    new ScriptExtHtmlWebpackPlugin({
      defaultAttribute: 'async'
    })
  ],

  module: {
    preLoaders: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        loader: 'eslint'
      }
    ],

    loaders: [
      {
        test: /\.json$/,
        exclude: /node_modules/,
        loader: 'json'
      },
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader?importLoaders=1!postcss-loader')
      },
      {
        test: /\.css$/,
        include: /node_modules/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader!postcss-loader!sass-loader')
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

  resolveLoader: {
    alias: {
      'jison-loader': path.resolve(__dirname, './jison-loader.js')
    }
  },

  resolve: {
    extensions: ['', '.js', '.css'],
    alias: {
      'images': imagesPath,
      'components': componentsPath,
      'layouts': layoutsPath,
      'modules': modulesPath
    }
  },

  postcss: [
    require('autoprefixer'),
    require('postcss-nested'),
    require('postcss-modules')({
      generateScopedName: '[folder]_[name]_[local]__[hash:base64:5]'
    })
  ],

  eslint: {
    failOnWarning: false,
    failOnError: true
  }
}
