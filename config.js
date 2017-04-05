module.exports = {
  path: './src/',
  testPath: './tests/',
  generate: {
    project: [
      require('./src/generators/project')
    ]
  }
}
