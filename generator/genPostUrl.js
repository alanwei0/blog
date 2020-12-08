const { dirname, basename } = require('path')

exports.genPostUrl = postPath => {
  const year = basename(dirname(postPath))
  return `/posts/${year}${basename(postPath, '.md')}`
}
