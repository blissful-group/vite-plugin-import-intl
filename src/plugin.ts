import { transform } from '@intl/transform'
import type { Plugin } from 'vite'

const pattern = /(.*?)import\.meta\.intl\(.*?;/g

export function plugin(): Plugin {
  return {
    name: 'intl-import-plugin',
    transform(code, id) {
      const [match, ...otherMatches] = code.match(pattern) ?? []

      if (!match) {
        return
      }

      if (otherMatches.length) {
        throw new Error('More then one match found with import.meta.intl')
      }

      return { code: transform({ code, match, id }) }
    },
  }
}
