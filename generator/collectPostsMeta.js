const fs = require('fs')
const path = require('path')
const _ = require('lodash')
const { extractPostMeta } = require('./utils/post-utils')
const { genPostUrl } = require('./genPostUrl')

/**
 * read all posts and return corresponding metadata, the result is sorted by createTime in desc order
 * example of return value:
 * [
 *   { createTime: 1606780800000, title: 'hello world', filePath: 'posts/2020/1201_hello_world.md' }
 * ]
 * @param globalConfig
 * @return {Promise} - array of post metadata
 */
exports.collectPostsMeta = async globalConfig => {
  const { POSTS_ROOT, prefixPath } = globalConfig
  const years = fs.readdirSync(POSTS_ROOT)

  const postPathArr = _(years)
    .map(y => {
      const dir = path.join(POSTS_ROOT, y)
      return fs.readdirSync(dir).map(f => path.join(dir, f))
    })
    .flatten()
    .value()

  let postMetaArr = await Promise.all(_.map(postPathArr, pPath => {
    return extractPostMeta(pPath)
      .then(meta => (
        {
          ...meta,
          filePath: pPath,
          url: genPostUrl(pPath, prefixPath),
          publishTime: +new Date(meta.publishTime)
        }
      ))
  }))
  // sort from latest to oldest
  postMetaArr.sort((a, z) => z.publishTime - a.publishTime)
  return postMetaArr
}
