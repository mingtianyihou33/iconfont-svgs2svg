const path = require('path')
const fs = require('fs')

function isSvg(filePath) {
  return path.extname(filePath) === '.svg'
}

function mkdirSync(dir) {
  if (fs.existsSync(dir)) return true
  if (mkdirSync(path.dirname(dir))) {
    fs.mkdirSync(dir)
    return true
  }
}

module.exports = {
  isSvg,
  mkdirSync
}
