const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin')

const buildPath = path.resolve(__dirname, './build')
const basePath = path.resolve(__dirname, './src')
const imagesPath = path.resolve(basePath, './assets/images')
const componentsPath = path.resolve(basePath, './components')
const layoutsPath = path.resolve(basePath, './layouts')
const modulesPath = path.resolve(basePath, './modules')

module.exports = {
  cache: true,
  debug: true,
  devtool: 'eval-source-map',

  entry: [
    'react-hot-loader/patch',
    'webpack-dev-server/client?http://localhost:3000',
    'webpack/hot/only-dev-server',
    './src/main.js'
  ],

  output: {
    path: buildPath,
    filename: 'app.js',
    publicPath: 'http://localhost:3000/build/'
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development')
      }
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new ExtractTextPlugin('style.css', {allChunks: true}),
    new HtmlWebpackPlugin({
      inject: 'head',
      template: path.resolve(basePath, './index.html')
    }),
    new ScriptExtHtmlWebpackPlugin({
      defaultAttribute: 'async'
    })
  ],

  module: {
    loaders: [
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
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader?modules&importLoaders=1&postcss-loader&localIdentName=[name]__[local]___[hash:base64:5]')
      },
      {
        test: /\.css$/,
        include: /node_modules/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader!postcss-loader!sass-loader?modules=true')
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
    extensions: ['', '.js', '.jsx', '.json', '.css'],
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
  ]
}
