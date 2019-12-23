// https://github.com/odota/underlordsconstants
import fs from 'fs-extra'
import path from 'path'

const outputDir = path.resolve(global.ROOT, './underlords')

fs.ensureDirSync(outputDir)

const LANGUAGE_MAPPING = [
  {
    locale: 'zh-CN',
    lng: '简体中文',
    fileKey: 'zh-CN',
    delimiter: '-',
  },

  {
    locale: 'ja-JP',
    lng: '日本語',
    fileKey: 'ja',
    delimiter: /—|－/,
  },
  {
    locale: 'en-US',
    lng: 'English',
    fileKey: 'en',
    delimiter: '-',
  },
]

const files = LANGUAGE_MAPPING.map(({ fileKey, locale, delimiter }) => ({
  delimiter,
  locale,
  data: require(`underlordsconstants/build/underlords_localization_${fileKey}.json`),
}))

const blockKeys = [
  'dac_item_anessixs_gift_lore',
  'dac_item_cinderwall_lore',
  'dac_map_challenge_combine_3stars_lore',
]
/**
 * filter aimless data
 * @param {{ [k: string]: string }} json
 * @return {{ [k: string]: string }}
 * @example
 * { "dac_item_claymore_lore": "What do ya want me to say, it's a sword. - <i>Zenok, White Spire Fence</i>" }
 */
const filterKey = json =>
  Object.fromEntries(
    Object.entries(json).filter(
      ([key, value]) =>
        key.endsWith('_lore') && !blockKeys.includes(key) && value && !value.endsWith('Lore'),
    ),
  )

/**
 *
 * @param {{ delimiter: string | RegExp, data: { [x: string]: string }}} json
 */
const format = ({ delimiter, data, ...rest }) => ({
  ...rest,
  data: Object.values(data).map(lore => {
    const [content, author] = lore.split(delimiter)
    return {
      content,
      author: author?.trim().replace(/^<i>|<\/i>$/g, ''),
    }
  }),
})

/**
 * @param {{ locale: string, data: Object[]}} json
 */
const out = json => {
  const langDir = path.resolve(outputDir, json.locale)
  fs.ensureDirSync(langDir)
  fs.outputJson(path.resolve(langDir, 'all.json'), json.data, { spaces: 2 })
  json.data.forEach((value, index) => {
    fs.outputJson(path.resolve(langDir, `${index}.json`), value, { spaces: 2 })
  })
  return json
}

const mapData = f => json => ({ ...json, data: f(json.data) })

/**
 * @type {{locale: string, data: { author: string, content: string }}[]}
 */
const data = files.map(mapData(filterKey)).map(format)

data.map(out)

const meta = {
  name: 'underlords',
  languages: data.map(d => d.locale),
  total: data[0].data.length,
  created: new Date(),
}

fs.outputJson(path.resolve(outputDir, 'meta.json'), meta, { spaces: 2 })
