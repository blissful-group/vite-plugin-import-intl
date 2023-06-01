import { transform } from '@intl/transform'
import type { Plugin } from 'vite'

const pattern = /(.*?)import\.meta\.intl\(.*?;/g

export function plugin(): Plugin {
  return {
    name: 'intl-import-plugin',
    async transform(code, id) {
      const matches: string[] = code.match(pattern) ?? []

      if (!matches.length) {
        return
      }

      const transforms = matches.map((match) => transform({ match, id }))
      const results = await Promise.all(transforms)

      return { code: matches.reduce((result, match, index) => result.replace(match, results[index]), code) }
    },
  }
}
