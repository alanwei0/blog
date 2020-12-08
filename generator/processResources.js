const fse = require('fs-extra')
const path = require('path')

exports.processResources = async ({ DIST_DIR, CLIENT_ROOT }) => {
  const copyCss = fse.copy(path.join(CLIENT_ROOT, 'css'), path.join(DIST_DIR, 'css'))
  const copyIcons = fse.copy(path.join(CLIENT_ROOT, 'icons'), path.join(DIST_DIR, 'icons'))
  const copyJs = fse.copy(path.join(CLIENT_ROOT, 'js'), path.join(DIST_DIR, 'js'))

  return Promise.all([copyCss, copyJs, copyIcons])
}
