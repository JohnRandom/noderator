import express from 'express'
import path from 'path'

const app = express()

// Serve application file depending on environment
app.get('/app.js', (req, res) => {
  if (process.env.PRODUCTION) {
    res.sendFile(path.join(__dirname, '/build/app.js'))
  } else {
    res.redirect('//localhost:3000/build/app.js')
  }
})

// Serve aggregate stylesheet depending on environment
app.get('/style.css', (req, res) => {
  if (process.env.PRODUCTION) {
    res.sendFile(path.join(__dirname, '/build/style.css'))
  } else {
    res.redirect('//localhost:3000/build/style.css')
  }
})

// Serve index page
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/build/index.html'))
})

if (!process.env.PRODUCTION) {
  const webpack = require('webpack')
  const WebpackDevServer = require('webpack-dev-server')
  const config = require('./webpack.dev.config')

  new WebpackDevServer(webpack(config), {
    publicPath: config.output.publicPath,
    hot: true,
    noInfo: true,
    historyApiFallback: true,
    stats: {
      colors: true,
      hash: false,
      version: false,
      timings: true,
      assets: false,
      chunks: false,
      modules: false,
      reasons: false,
      children: false,
      source: false,
      errors: true,
      errorDetails: true,
      warnings: true,
      publicPath: false
    }
  }).listen(3000, 'localhost', (err, result) => {
    if (err) {
      console.log(err)
    }
  })
}

const port = process.env.PORT || 8080
const server = app.listen(port, 'localhost', () => {
  const host = server.address().address
  const port = server.address().port

  console.log(`Server listening at http://${host}:${port}`)
})
