const fse = require('fs-extra')
const path = require('path')

exports.processResources = async ({ DIST_DIR, TEMPLATES_ROOT }) => {
  const copyCss = fse.copy(path.join(TEMPLATES_ROOT, 'resources'), DIST_DIR)
  // const copyJs = fse.copy(path.join(TEMPLATES_ROOT, 'js'), path.join(DIST_DIR, 'js'))

  return Promise.all([copyCss/*, copyJs*/])
}
