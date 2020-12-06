const { forEach } = require('lodash')
const ejs = require('ejs')
const fse = require('fs-extra')
const path = require('path')
const { genPostUrl } = require('./genPostUrl')

/**
 * group post meta by year
 * example of return:
 * [
 *   { year: 2020, posts: [{ title: 'dd', createTime: 1221421343, filePath: '..' }] }
 * ]
 * @param postMetas
 * @return {[]}
 */
const groupByYear = postMetas => {
  const res = []
  let group = {}

  forEach(postMetas, pm => {
    const pm1 = { ...pm, url: genPostUrl(pm.filePath) }
    const currYear = new Date(pm1.publishTime).getFullYear()
    if (group.year === undefined) {
      group.year = currYear
      group.posts = []
    }
    if (group.year === currYear) {
      group.posts.push(pm1)
    } else {
      res.push(group)
      group = { year: currYear, posts: [pm1] }
    }
  })

  if (group.year !== undefined) {
    res.push(group)
  }

  return res
}

exports.genIndexPages = async (postMetas, { DIST_DIR, TEMPLATES_ROOT, blogName }) => {
  // group by year
  const postGroups = groupByYear(postMetas)
  const templateStr = fse.readFileSync(path.join(TEMPLATES_ROOT, 'index.ejs'), 'utf8')
  const indexTemplate = ejs.compile(templateStr, { root: TEMPLATES_ROOT })
  const indexPage = indexTemplate({ blogName, postGroups })
  await fse.outputFile(path.join(DIST_DIR, 'index.html'), indexPage, 'utf8')
}
