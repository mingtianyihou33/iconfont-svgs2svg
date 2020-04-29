const path = require('path')
const fs = require('fs')

function isSvg(filePath) {
  return path.extname(filePath) === '.svg'
}

function mkdirsSync(dir) {
  if (fs.existsSync(dir)) return true
  if (mkdirsSync(path.dirname(dir))) {
    fs.mkdirSync(dir)
    return true
  }
}

module.exports = {
  isSvg,
  mkdirsSync
}
