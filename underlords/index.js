// https://github.com/odota/underlordsconstants
import fs from 'fs'
import path from 'path'

const outputDir = path.resolve(global.ROOT, './underlords')

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir)
}

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
    delimiter: '—',
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
  source: 'underlords',
  data: require(`underlordsconstants/build/underlords_localization_${fileKey}.json`),
}))

const blockKeys = ['dac_map_challenge_combine_3stars_lore'] // "This is the lore for the challenge where you need to get a 3 star of some particular hero."
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
 * @param { delimiter: string, data: { [k: string]: string }} json
 * @returns {{ data: { author?: string, content: string }, [x: string]: string}}
 */
const format = ({ delimiter, data, ...rest }) => ({
  ...rest,
  data: Object.values(data).map(lore => {
    const [content, author] = lore.split(delimiter)
    return {
      author: author?.trim().replace(/^<i>|<\/i>$/g, ''),
      content,
    }
  }),
})

const out = json =>
  fs.writeFileSync(
    path.resolve(outputDir, `${json.locale}.json`),
    JSON.stringify(json.data, undefined, 2),
  )

const mapData = f => json => ({ ...json, data: f(json.data) })

files
  .map(mapData(filterKey))
  .map(format)
  .map(out)
