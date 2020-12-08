const Prism = require('prismjs')
const _ = require('lodash')
const fse = require('fs-extra')
const path = require('path')
const ejs = require('ejs')
const { extractPostContent } = require('./utils/post-utils')

// load languages
require('prismjs/components/index')(['typescript', 'jsx', 'tsx', 'less', 'scss'])

const md = require('markdown-it')({
  // Enable HTML tags in source
  html: true,
  highlight: (code, lang) => {
    if (Prism.languages[lang] === undefined) {
      throw new Error(`unknown language: ${lang}`)
    }
    return Prism.highlight(code, Prism.languages[lang], lang)
  }
})

exports.genPostPages = async (postMetas, globalConfig) => {
  const { DIST_DIR, TEMPLATES_DIR } = globalConfig

  await Promise.all([_.map(postMetas, async (meta, i) => {
    // read post md file
    const str = await extractPostContent(meta.filePath)
    const postHTML = md.render(str)

    const templateStr = fse.readFileSync(path.join(TEMPLATES_DIR, 'post.ejs'), 'utf8')
    const postTemplate = ejs.compile(templateStr, { root: TEMPLATES_DIR })
    const postPage = postTemplate({
      ...meta,
      ...globalConfig,
      postHTML,
      previous: postMetas[i - 1],
      next: postMetas[i + 1],
    })
    await fse.outputFile(path.join(DIST_DIR, meta.url, 'index.html'), postPage, 'utf8')
  })])
}
