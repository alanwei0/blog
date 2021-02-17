const path = require('path')
const fse = require('fs-extra')
const { genPostPages } = require('./genPostPages')
const { processResources } = require('./processResources')
const { collectPostsMeta } = require('./collectPostsMeta')
const { genHomePages } = require('./genHomePages')

const APP_ROOT = path.resolve(__dirname, '..')

const globalConfig = {
  APP_ROOT,
  DIST_DIR: path.join(APP_ROOT, 'dist'),
  POSTS_ROOT: path.join(APP_ROOT, 'posts'),
  CLIENT_ROOT: path.resolve(__dirname, 'client'),
  TEMPLATES_DIR: path.resolve(__dirname, 'client/templates'),
  ...require('../config')
}

if (process.env.NODE_ENV !== 'production') {
  globalConfig.prefixPath = ''
}

(async () => {
  try {
    fse.removeSync(globalConfig.DIST_DIR)
    // process all resources like javascript, css, image, etc.
    await processResources(globalConfig)

    const postMetaArr = await collectPostsMeta(globalConfig)

    // generate index page & list pages
    await genHomePages(postMetaArr, globalConfig)

    // generate post pages
    await genPostPages(postMetaArr, globalConfig)
  } catch (e) {
    // clean
    fse.removeSync(globalConfig.DIST_DIR)

    throw e
  }
})()

