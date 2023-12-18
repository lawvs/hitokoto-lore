// https://github.com/odota/underlordsconstants
import fs from "fs-extra";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

const outputDir = path.resolve(process.env.BUILD_ROOT, "./underlords");
const abilitiesOutputDir = path.resolve(
  process.env.BUILD_ROOT,
  "./underlords-abilities"
);

const now = new Date();

fs.ensureDirSync(outputDir);

const LANGUAGE_MAPPING = [
  {
    locale: "zh-CN",
    lng: "简体中文",
    fileKey: "zh-CN",
    delimiter: /-|—/,
  },
  {
    locale: "ja-JP",
    lng: "日本語",
    fileKey: "ja",
    delimiter: /—|－|ー <i>/,
  },
  {
    locale: "en-US",
    lng: "English",
    fileKey: "en",
    delimiter: "-",
  },
];

const files = LANGUAGE_MAPPING.map(({ fileKey, locale, delimiter }) => ({
  delimiter,
  locale,
  name: require(`underlordsconstants/build/underlords_localization_${fileKey}.json`)[
    "dac_gamename"
  ],
  data: require(`underlordsconstants/build/underlords_localization_${fileKey}.json`),
}));

const blockKeys = [
  "dac_item_anessixs_gift_lore",
  "dac_item_cinderwall_lore",
  "dac_map_challenge_combine_3stars_lore",
  // abilities
  "dac_ability_anessix_summon_companions_lore",
  "dac_ability_anessix_summon_golem_lore",
  "dac_ability_anessix_companion_archer_passive_lore",
  "dac_ability_anessix_pure_pain_lore",
  "dac_ability_anessix_martyrs_boon_lore",
  "dac_ability_demon_warrior_bash_lore",
];

/**
 * filter aimless data
 * @param {{ [k: string]: string }} json
 * @return {{ [k: string]: string }}
 * @example
 * { "dac_item_claymore_lore": "What do ya want me to say, it's a sword. - <i>Zenok, White Spire Fence</i>" }
 */
const filterKey = (json) =>
  Object.fromEntries(
    Object.entries(json)
      .map(([key, value]) => [key.trim(), value.trim()])
      .filter(
        ([key, value]) =>
          key.endsWith("_lore") &&
          !key.endsWith("_description_lore") &&
          !blockKeys.includes(key) &&
          value
        // !value.endsWith('lore') &&
        // !value.endsWith('Lore') &&
        // !value.endsWith('の説明'),
      )
  );

/**
 * @param {{ delimiter: string | RegExp, data: { [x: string]: string }}} json
 */
const format = ({ delimiter, data, ...rest }) => ({
  ...rest,
  data: Object.entries(data).map(([key, lore]) => {
    const [content, author] = lore.split(delimiter);
    return {
      key,
      content: content.trim().replace(/^<i>|<\/i>$/g, ""),
      author: author?.trim().replace(/^<i>|^<I>|<\/i>$|<i>$/g, ""),
    };
  }),
});

/**
 * @param {{ locale: string, data: Object[]}} json
 */
const output = (id, dir) => (json) => {
  const langDir = path.resolve(dir, json.locale);
  fs.ensureDirSync(langDir);
  // output complete data
  fs.outputJson(path.resolve(langDir, "all.json"), json.data, { spaces: 2 });
  // output splitted data
  json.data.forEach((value, index) => {
    fs.outputJson(path.resolve(langDir, `${index}.json`), value, { spaces: 2 });
  });

  // output meta
  const meta = {
    id,
    name: json.name,
    language: json.locale,
    total: json.data.length,
    created: now,
  };
  fs.outputJsonSync(path.resolve(langDir, "meta.json"), meta, { spaces: 2 });
  return json;
};

const mapData = (f) => (json) => ({ ...json, data: f(json.data) });

/**
 * @type {{locale: string, data: { author?: string, content: string }}[]}
 */
const data = files.map(mapData(filterKey)).map(format);

data.map(output("underlords", outputDir));

// build underlords abilities
console.log("Build underlords abilities...");

const abilitiesFiles = LANGUAGE_MAPPING.map(
  ({ fileKey, locale, delimiter }) => ({
    delimiter,
    locale,
    name: require(`underlordsconstants/build/underlords_localization_${fileKey}.json`)[
      "dac_gamename"
    ],
    data: require(`underlordsconstants/build/underlords_localization_abilities_${fileKey}.json`),
  })
);

const abilitiesData = abilitiesFiles.map(mapData(filterKey)).map(format);

abilitiesData.map(output("underlords-abilities", abilitiesOutputDir));
