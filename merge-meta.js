import fs from 'fs-extra'
import path from 'path'

const metaList = fs
  .readdirSync(global.BUILD_ROOT)
  .map(filename => path.resolve(global.BUILD_ROOT, filename, 'meta.json'))
  .filter(metafile => fs.existsSync(metafile))
  .map(metafile => fs.readJSONSync(metafile))

fs.outputJsonSync(path.resolve(global.ROOT, 'meta.json'), metaList, { spaces: 2 })
