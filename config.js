module.exports = {
  srcPath: null,
  generate: {
    project: [ require('./src/generators/project') ],
    module: [ require('./src/generators/module') ],
    component: [ require('./src/generators/component') ]
  }
}
