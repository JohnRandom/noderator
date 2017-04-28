const autoprefixer = require('autoprefixer')
const postcssNested = require('postcss-nested')

module.exports = {
  fallback: 'style-loader',
  use: [{
    loader: 'css-loader',
    options: {
      importLoaders: 1,
      modules: true,
      localIdentName: '[folder]_[name]_[local]__[hash:base64:5]'
    }
  }, {
    loader: 'postcss-loader',
    options: {
      plugins: [ autoprefixer(), postcssNested() ]
    }
  }]
}
