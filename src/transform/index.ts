import fg from 'fast-glob'
import path from 'path'
import { v4 as uuid } from 'uuid'

type TransformConfig = { code: string; match: string; id: string }

export function transform({ code, match, id }: TransformConfig) {
  const [parameters] = match.match(/\((.*?)\)/gm) ?? []
  const [variable] = match.match(/(.*)= /gm) ?? []

  if (!parameters) {
    return match
  }

  const globs = parameters
    .replace(/[()'"[\]]/g, '')
    .split(',')
    .flatMap((parameter) => path.join(path.dirname(id), parameter.trim()))

  const uniqueJSONPaths = fg.sync([...new Set(globs)]).filter((item) => item.endsWith('json'))

  let importStatement = ''
  let variableStatement = `\n${variable}{`

  uniqueJSONPaths.forEach((uniqueJSONPath) => {
    const name = path.basename(uniqueJSONPath, '.json')
    const safeName = `_${uuid().replace(/-/g, '')}`

    importStatement += `\nimport ${safeName} from '${uniqueJSONPath}';`
    variableStatement += `\n  '${name}': ${safeName},`
  })

  variableStatement += '\n}'

  return code.replace(match, `${importStatement}${variableStatement}`)
}
