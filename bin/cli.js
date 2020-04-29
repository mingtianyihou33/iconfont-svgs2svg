#!/usr/bin/env node
const convert = require('../src/index')
const path = require('path')
let args = process.argv.slice(2)

function error(msg) {
  console.error(logStyle.red[0], msg)
}

function log(msg) {
  console.log(msg)
}

let logStyle = {
  'bold': ['\x1B[1m%s\x1B[22m'],
  'italic': ['\x1B[3m%s\x1B[23m'],
  'underline': ['\x1B[4m%s\x1B[24m'],
  'inverse': ['\x1B[7m%s\x1B[27m'],
  'strikethrough': ['\x1B[9m%s\x1B[29m'],
  'white': ['\x1B[37m%s\x1B[39m'],
  'grey': ['\x1B[90m%s\x1B[39m'],
  'black': ['\x1B[30m%s\x1B[39m'],
  'blue': ['\x1B[34m%s\x1B[39m'],
  'cyan': ['\x1B[36m%s\x1B[39m'],
  'green': ['\x1B[32m%s\x1B[39m'],
  'magenta': ['\x1B[35m%s\x1B[39m'],
  'red': ['\x1B[31m%s\x1B[39m'],
  'yellow': ['\x1B[33m%s\x1B[39m'],
  'whiteBG': ['\x1B[47m%s\x1B[49m'],
  'greyBG': ['\x1B[49;5;8m%s\x1B[49m'],
  'blackBG': ['\x1B[40m%s\x1B[49m'],
  'blueBG': ['\x1B[44m%s\x1B[49m'],
  'cyanBG': ['\x1B[46m%s\x1B[49m'],
  'greenBG': ['\x1B[42m%s\x1B[49m'],
  'magentaBG': ['\x1B[45m%s\x1B[49m'],
  'redBG': ['\x1B[41m%s\x1B[49m'],
  'yellowBG': ['\x1B[43m%s\x1B[49m']
};
if (args.length < 2) {
  error("input and output directory is required!")
  process.exit(1)
}
let inputDir, outputDir
// iconfont inputDir outputDir
// iconfont -i inputDir -o outputDir
if (args.length === 2) {
  inputDir = args[0]
  outputDir = args[1]
} else {
  let iIndex = args.indexOf('-i')
  let oIndex = args.indexOf('-o')
  if (iIndex > -1) {
    inputDir = args[iIndex + 1]
    args.splice(iIndex, 2)
  }
  if (oIndex > -1) {
    outputDir = args[oIndex + 1]
    args.splice(oIndex, 2)
  }
  if (args.length > 0 && (!inputDir || !outputDir)) {
    inputDir && !outputDir && (outputDir = args[0])
    outputDir && !inputDir && (inputDir = args[0])
    if (!inputDir && !outputDir) {
      inputDir = args[0]
      outputDir = args[1]
    }
  }
}

if (!inputDir || !outputDir) {
  error("input and output directory is required!")
  process.exit(1)
}
log('inputDir is ' + inputDir)
log('outputDir is ' + outputDir)
try {
  convert(inputDir, outputDir)
  log('succeed')
  process.exit(0)
} catch (e) {
  error(e)
  process.exit(1)
}
