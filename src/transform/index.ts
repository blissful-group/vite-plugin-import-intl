import fg from 'fast-glob'
import fs from 'fs'
import path from 'path'
import { compileString } from '@internationalized/string-compiler'

type TransformConfig = { match: string; id: string }

export async function transform({ match, id }: TransformConfig) {
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

  const filesPromised = filePaths.map((filePath) => fs.promises.readFile(filePath, { encoding: 'utf8' }))
  const contentsRaw = await Promise.all(filesPromised)
  const contentsParsed = contentsRaw.map((content) => JSON.parse(content))

  return `${variable}{${filePaths.map(
    (filePath, index) =>
      `'${path.basename(filePath, '.json')}': {${Object.entries(contentsParsed[index]).reduce(
        (result, [key, value]) => `${result}${key}: ${typeof value === 'string' ? compileString(value) : value},`,
        '',
      )}}`,
  )}}`
}
