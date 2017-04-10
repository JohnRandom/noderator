const path = require('path')
const { generate } = require('../../utils')

const defaultPath = './src/modules'
const templateDir = path.join(__dirname, 'template')
const placeholder = 'MODULE_NAME'

const generateModule = generate(defaultPath, templateDir, placeholder)

module.exports = generateModule
