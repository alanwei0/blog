const fse = require('fs-extra')
const { createInterface } = require('readline')
const yaml = require('yaml')

const DIVIDER = '---'

exports.extractPostMeta = filePath => new Promise((resolve, reject) => {
  let strArr = []
  let got = false
  const rl = createInterface({
    input: fse.createReadStream(filePath),
    crlfDelay: Infinity
  })

  rl.on('line', line => {
    // meta head end
    if (line.startsWith(DIVIDER)) {
      got = true
      rl.close()
      try {
        resolve(yaml.parse(strArr.join('\n')))
      } catch (e) {
        reject(e)
      }
    } else {
      strArr.push(line)
    }
  })

  rl.on('close', () => {
    if (!got) {
      reject(`no meta head found in the post: ${filePath}`)
    }
  })
})

exports.extractPostContent = filePath => new Promise((resolve, reject) => {
  let strArr = []
  let got = false
  const rl = createInterface({
    input: fse.createReadStream(filePath),
    crlfDelay: Infinity
  })

  rl.on('line', line => {
    if (line.startsWith(DIVIDER) && !got) {
      got = true
    } else if (got) {
      strArr.push(line)
    }
  })

  rl.on('close', () => {
    try {
      resolve(strArr.join('\n'))
    } catch (e) {
      reject(e)
    }
  })
})
