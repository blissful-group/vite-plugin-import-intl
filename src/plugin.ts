import { transform } from '@intl/transform'
import type { Plugin } from 'vite'

const pattern = /(.*?)import\.meta\.intl\(.*?;/g

export function plugin(): Plugin {
  return {
    name: 'intl-import-plugin',
    transform(code, id) {
      const matches: string[] = code.match(pattern) ?? []

      if (!matches.length) {
        return
      }

      return { code: matches.reduce((result, match) => transform({ code: result, match, id }), code) }
    },
  }
}
