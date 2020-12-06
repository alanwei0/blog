const fs = require('fs')
const path = require('path')
const { createInterface } = require('readline')
const yaml = require('yaml')
const _ = require('lodash')

const extractMeta = filePath => new Promise((resolve, reject) => {
  let strArr = []
  let got = false
  const rl = createInterface({
    input: fs.createReadStream(filePath),
    crlfDelay: Infinity
  })

  rl.on('line', line => {
    // meta head end
    if (line.startsWith('---')) {
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

/**
 * read all posts and return corresponding metadata, the result is sorted by createTime in desc order
 * example of return value:
 * [
 *   { createTime: 1606780800000, title: 'hello world', filePath: 'posts/2020/1201_hello_world.md' }
 * ]
 * @param postsRoot - root path of posts
 * @return {Promise} - array of post metadata
 */
exports.collectPostsMeta = async postsRoot => {
  const years = fs.readdirSync(postsRoot)

  const postPathArr = _(years)
    .map(y => {
      const dir = path.join(postsRoot, y)
      return fs.readdirSync(dir).map(f => path.join(dir, f))
    })
    .flatten()
    .value()

  let postMetaArr = await Promise.all(_.map(postPathArr, pPath => {
    return extractMeta(pPath)
      .then(meta => ({ ...meta, filePath: pPath, publishTime: +new Date(meta.publishTime) }))
  }))
  // sort from latest to oldest
  postMetaArr.sort((a, z) => z.publishTime - a.publishTime)
  return postMetaArr
}
