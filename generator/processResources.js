const fse = require('fs-extra')
const path = require('path')

exports.processResources = async ({ DIST_DIR, CLIENT_ROOT }) => {
  const copyCss = fse.copy(path.join(CLIENT_ROOT, 'css'), path.join(DIST_DIR, 'css'))
  const copyIcons = fse.copy(path.join(CLIENT_ROOT, 'images'), path.join(DIST_DIR, 'images'))
  const copyJs = fse.copy(path.join(CLIENT_ROOT, 'js'), path.join(DIST_DIR, 'js'))

  return Promise.all([copyCss, copyJs, copyIcons])
}
