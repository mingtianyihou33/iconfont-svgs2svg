const path = require('path')

function isSvg(filePath) {
  return path.extname(filePath) === '.svg'
}

module.exports = {
  isSvg
}
