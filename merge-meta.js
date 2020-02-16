import fs from 'fs-extra'
import path from 'path'

const metaList = fs
  //['index.html', 'main.js', 'underlords', 'underlords-abilities']
  .readdirSync(global.BUILD_ROOT)
  // completion path
  .map(filename => path.resolve(global.BUILD_ROOT, filename))
  // filter folder
  .filter(path => fs.lstatSync(path).isDirectory())
  .flatMap(p => fs.readdirSync(p).map(filename => path.join(p, filename)))
  .map(p => path.join(p, 'meta.json'))
  .filter(metafile => fs.existsSync(metafile) && fs.lstatSync(metafile).isFile())
  .map(metafile => fs.readJSONSync(metafile))

fs.outputJsonSync(path.resolve(global.ROOT, 'meta.json'), metaList, { spaces: 2 })
