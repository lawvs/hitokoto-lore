import sample from 'lodash.sample'

import meta from './meta.json'

interface Hitokoto {
  key: string
  content: string
  author?: string
}

interface LoreOptions {
  baseUrl: string
  language: 'en-US' | 'zh-CN' | 'ja-JP' | 'random'
  meta: typeof meta
}

const locales: LoreOptions['language'][] = ['en-US', 'zh-CN', 'ja-JP', 'random']

const formatLang = (lang?: string) => {
  if (!lang) {
    return 'en-US'
  }
  if (locales.includes(lang as any)) {
    return lang as LoreOptions['language']
  }
  switch (lang.slice(0, 2).toLowerCase()) {
    case 'zh':
      return 'zh-CN'
    case 'ja':
      return 'ja-JP'
    default:
      return 'en-US'
  }
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is no lower than min (or the next integer greater than min
 * if min isn't an integer) and no greater than max (or the next integer
 * lower than max if max isn't an integer).
 * Using Math.round() will give you a non-uniform distribution!
 *
 * @see https://stackoverflow.com/questions/1527803/generating-random-whole-numbers-in-javascript-in-a-specific-range
 */
function getRandomInt(min: number, max: number) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * @example
 * const lore = new Lore()
 * // With custom options `new Lore({ language: 'random' })`
 * await lore.fastHitokoto()
 * // "Be a boon to your allies.  ——Zenok, White Spire Fence"
 * await lore.hitokoto()
 * // {content: "Ahhh there's that famous human spirit. ", author: "Zenok, White Spire Fence"}
 */
class Lore {
  defaultOptions: Readonly<LoreOptions> = {
    baseUrl: 'https://raw.githubusercontent.com/lawvs/hitokoto-lore/gh-pages',
    language: formatLang(globalThis?.navigator?.language),
    meta,
  }

  options = this.defaultOptions

  constructor(options: Partial<LoreOptions> = {}) {
    this.options = {
      ...this.defaultOptions,
      ...options,
    }
  }

  private get metaList() {
    if (this.options.language === 'random') {
      return this.options.meta
    }
    return this.options.meta.filter(m => m.language === this.options.language)
  }

  /**
   * @example
   * "{"key":"dac_item_blight_stone_lore","content":"A subtle, but effective tool.","author":"Zenok, White Spire Fence"}"
   */
  async hitokoto() {
    const selectedMeta = sample(this.metaList)
    if (!selectedMeta) {
      throw new Error('No list available')
    }

    const random = getRandomInt(0, selectedMeta.total - 1)
    const url = `${this.options.baseUrl}/${selectedMeta.id}/${selectedMeta.language}/${random}.json`
    if (!globalThis.fetch) {
      throw new Error('fetch not found')
    }
    const resp = await fetch(url)
    const data: Hitokoto = await resp.json()
    return {
      ...data,
      language: selectedMeta.language,
      from: selectedMeta.name,
      created: selectedMeta.created,
    }
  }

  /**
   * @example
   * "Don't tell anyone, but you're my favorite criminal mastermind. — Zenok, White Spire Fence"
   */
  async fastHitokoto() {
    const hitokoto = await this.hitokoto()
    return `${hitokoto.content}${hitokoto.author ? ` — ${hitokoto.author}` : ''}`
  }
}

export default Lore
