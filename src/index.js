const fs = require('fs')
const xmlJs = require('xml-js')
const {isSvg} = require('./util')
const path = require('path')
let inputPath = 'inputDir'
// let inputPath = 'inputDir/iconfont.svg'
let outputPath = 'outputDir'
try {
  const files = readSvgFiles(inputPath)
  files.forEach(file => {
    svgsToSvg(file[0], file[1])
  })
} catch (e) {
  console.error(e)
}

function readSvgFiles(inputPath) {
  let files = []
  let svgPaths = []
  if (fs.statSync(inputPath).isDirectory()) {
    let inputDir = fs.readdirSync(inputPath)
    inputDir.forEach(filename => {
      if (isSvg(filename)) {
        svgPaths.push(`${inputPath}/${filename}`)
      }
    })
  } else {
    if (isSvg(inputPath)) {
      svgPaths.push(inputPath)
    }
  }
  svgPaths.forEach(svgPath => {
    files.push([fs.readFileSync(svgPath), path.basename(svgPath, '.svg')])
  })
  return files
}

function svgsToSvg(file, dirname) {
  let content = file.toString()
  let obj = xmlJs.xml2js(content)
  let svgTemplate = getSvgTemplateObj()
  let svgTemplatePathAttr = svgTemplate.elements[1].elements[0].attributes
  let svg = obj.elements.find(element => element.name === 'svg')
  let defs = svg.elements.find(element => element.name === 'defs')
  let font = defs.elements.find(element => element.name === 'font')
  let fontElements = font.elements
  let baseDir = `${outputPath}/${dirname}`
  if(!fs.existsSync(baseDir)) fs.mkdirSync(baseDir)
  for (let i = fontElements.length - 1; i >= 0; i--) {
    if (fontElements[i].name === "glyph") {
      let attrs = fontElements[i].attributes
      svgTemplatePathAttr.d = attrs['d']
      fs.writeFileSync(`${baseDir}/${attrs['glyph-name']}.svg`, xmlJs.js2xml(svgTemplate))
    }
  }
}

function getSvgTemplateObj() {
  let file = fs.readFileSync('src/iconfontSvgTemplate.svg')
  let content = file.toString()
  return xmlJs.xml2js(content)
}
