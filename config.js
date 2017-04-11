module.exports = {
  generate: {
    project: [ require('./src/generators/project') ],
    module: [ require('./src/generators/module').generateModule ],
    component: [ require('./src/generators/component') ],
    service: [ require('./src/generators/module').generateService ]
  }
}
