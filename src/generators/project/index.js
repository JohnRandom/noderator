const path = require('path')
const { generate } = require('../../utils')

const basePath = '.'
const templateDir = path.join(__dirname, 'template')
const placeholder = 'PROJECT_NAME'

const generateProject = generate(basePath, templateDir, placeholder)

module.exports = generateProject
