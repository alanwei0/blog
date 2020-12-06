const { basename, join } = require('path')

exports.genPostUrl = postPath => join('/posts/', basename(postPath, '.md'))
