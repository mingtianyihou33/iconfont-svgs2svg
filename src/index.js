const fs = require('fs')
const xmlJs = require('xml-js')
const {isSvg, mkdirSync} = require('./util')
const path = require('path')


function readSvgFiles(inputPath) {
  let filesAndDir = []
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
    filesAndDir.push([fs.readFileSync(svgPath), path.basename(svgPath, '.svg')])
  })
  return filesAndDir
}

function svgBundleToSingleSvg(file, dirname, outputPath) {
  let content = file.toString()
  let obj = xmlJs.xml2js(content)
  let svgTemplate = getSvgTemplateObj()
  let svgTemplatePathAttr = svgTemplate.elements[1].elements[0].attributes
  let svg = obj.elements.find(element => element.name === 'svg')
  let defs = svg.elements.find(element => element.name === 'defs')
  let font = defs.elements.find(element => element.name === 'font')
  let fontElements = font.elements
  let baseDir = `${outputPath}/${dirname}`
  mkdirSync(baseDir)
  for (let i = fontElements.length - 1; i >= 0; i--) {
    if (fontElements[i].name === "glyph") {
      let attrs = fontElements[i].attributes
      svgTemplatePathAttr.d = attrs['d']
      fs.writeFileSync(`${baseDir}/${attrs['glyph-name']}.svg`, xmlJs.js2xml(svgTemplate))
    }
  }
}

// function turnVertical(d) {
//   let str = ''
//   // M = moveto
//   // L = lineto
//   // H = horizontal lineto
//   // V = vertical lineto
//   // C = curveto
//   // S = smooth curveto
//   // Q = quadratic Bézier curve
//   // T = smooth quadratic Bézier curveto
//   // A = elliptical Arc
//   // Z = closepath
//   const tags = ['M', 'm', 'L', 'l', 'H', 'h', 'V', 'v', 'C', 'c', 'S', 's', 'Q', 'q', 'T', 't', 'A', 'a', 'Z', 'z']
//   const viewBoxHeight = 1024
//   let tagAndPosition = []
//   for (let i = 0; i < d.length; i++) {
//     if (tags.includes(d[i])) {
//       tagAndPosition.push([d[i], i])
//     }
//   }
//   tagAndPosition.forEach(([tag, position], i) => {
//     str += tag
//     let pointStr
//     if (tagAndPosition[i + 1]) {
//       pointStr = d.substring(position + 1, tagAndPosition[i + 1][1])
//     } else {
//       pointStr = d.substring(position + 1)
//     }
//     pointStr = pointStr.trim()
//     if (!pointStr) return
//     // 水平和垂直只有横轴或纵轴，需要特别处理
//     switch (tag) {
//       case 'H':
//       case 'h':
//         str += ` ${pointStr} `
//         break
//       case 'V':
//         str += ` ${viewBoxHeight - pointStr} `
//         break
//       case 'h':
//         str += ` ${-pointStr} `
//         break
//       default:
//         str += pointStr.split(' ').reduce((pre, cur, index)=>{
//           if(index % 2 === 0){
//             if(tag >= 'a' && tag<= 'z'){
//               return `${pre} ${-cur} `
//             } else {
//               return `${pre} ${viewBoxHeight - cur} `
//             }
//           } else {
//             return `${pre} ${cur} `
//           }
//         })
//     }
//   })
//   return str
// }

function getSvgTemplateObj() {
  let file = fs.readFileSync(path.resolve(__dirname, 'iconfontSvgTemplate.svg'))
  let content = file.toString()
  return xmlJs.xml2js(content)
}

function convert(inputPath, outputPath) {
  const filesAndDir = readSvgFiles(inputPath)
  filesAndDir.forEach(([file, dirname]) => {
    svgBundleToSingleSvg(file, dirname, outputPath)
  })
}

module.exports = convert
