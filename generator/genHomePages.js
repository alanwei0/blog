const { forEach } = require('lodash')
const ejs = require('ejs')
const fse = require('fs-extra')
const path = require('path')

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
    const currYear = new Date(pm.publishTime).getFullYear()
    if (group.year === undefined) {
      group.year = currYear
      group.posts = []
    }
    if (group.year === currYear) {
      group.posts.push(pm)
    } else {
      res.push(group)
      group = { year: currYear, posts: [pm] }
    }
  })

  if (group.year !== undefined) {
    res.push(group)
  }

  return res
}

exports.genHomePages = async (postMetas, globalConfig) => {
  const { DIST_DIR, TEMPLATES_DIR, blogName } = globalConfig
  // group by year
  const postGroups = groupByYear(postMetas)
  const templateStr = fse.readFileSync(path.join(TEMPLATES_DIR, 'home.ejs'), 'utf8')
  const indexTemplate = ejs.compile(templateStr, { root: TEMPLATES_DIR })
  const indexPage = indexTemplate({ blogName, postGroups, ...globalConfig })
  await fse.outputFile(path.join(DIST_DIR, 'index.html'), indexPage, 'utf8')
}
