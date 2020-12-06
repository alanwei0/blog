const path = require('path')
const { processResources } = require('./processResources')
const { collectPostsMeta } = require('./collectPostsMeta')
const { genIndexPages } = require('./genIndexPages')

const APP_ROOT = path.resolve(__dirname, '..')

const globalConfig = {
  APP_ROOT,
  DIST_DIR: path.join(APP_ROOT, 'dist'),
  POSTS_ROOT: path.join(APP_ROOT, 'posts'),
  TEMPLATES_ROOT: path.resolve(__dirname, 'templates'),
  ...require('../config')
}

;(async () => {
  // process all resources like javascript, css, image, etc.
  await processResources(globalConfig)

  const postMetaArr = await collectPostsMeta(globalConfig.POSTS_ROOT)

  // generate index page & list pages
  await genIndexPages(postMetaArr, globalConfig)

  // generate post pages
})()

