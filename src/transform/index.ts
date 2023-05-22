import fg from 'fast-glob'
import fs from 'fs'
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

  const filePaths = fg
    .sync(globs)
    .filter((file) => file.endsWith('json'))
    .filter((file) => fs.statSync(file).size > 0)

  let importStatement = ''
  let variableStatement = `\n${variable}{`

  filePaths.forEach((filePath) => {
    const name = path.basename(filePath, '.json')
    const safeName = `_${uuid().replace(/-/g, '')}`

    importStatement += `\nimport ${safeName} from '${filePath}';`
    variableStatement += `\n  '${name}': ${safeName},`
  })

  variableStatement += '\n}'

  return code.replace(match, `${importStatement}${variableStatement}`)
}
