const { dirname, basename } = require('path')

/**
 * generate the post url by original file path
 * for example:
 * 2020/1201_hello_alan_hello_world => /posts/20201201_hello_alan_hello_world
  */
exports.genPostUrl = postPath => {
  const year = basename(dirname(postPath))
  return `/posts/${year}${basename(postPath)}`
}
