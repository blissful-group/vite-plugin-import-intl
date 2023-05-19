import { plugin } from '@intl/plugin'

it('should be a function', () => {
  expect(typeof plugin).toEqual('function')
})

it('should return an object with a name and transform of type function', () => {
  const instance = plugin()

  expect(instance).toHaveProperty('name')
  expect(instance).toHaveProperty('transform')
  expect(typeof instance.transform).toEqual('function')
})

it('should return undefined on no transform matches', () => {
  const instance: any = plugin()
  const matchedString = 'no match'

  const transformed = instance.transform(matchedString, process.cwd())

  expect(transformed).toEqual(undefined)
})

it('should handle multiple transforms', () => {
  const instance: any = plugin()
  const string1 = "const test_1 = import.meta.intl(['*/package.json']);"
  const string2 = "const test_2 = import.meta.intl(['*/tsconfig.json']);"
  const string3 = "const test_3 = import.meta.intl(['*/tsconfig.json', '*/package.json']);"
  const strings = `${string1}\n${string2}\n${string3}`

  const transformed = instance.transform(strings, process.cwd())

  expect(transformed.code).toEqual(expect.stringContaining('const test_1 = {'))
  expect(transformed.code).toEqual(expect.stringContaining('const test_2 = {'))
  expect(transformed.code).toEqual(expect.stringContaining('const test_3 = {'))
})

it('should transform files according to the file system', () => {
  const instance: any = plugin()
  const matchedString = `const test = import.meta.intl(['vite-plugin-*/package.json']);`

  const transformed = instance.transform(matchedString, process.cwd())

  expect(transformed).toHaveProperty('code')
  expect(transformed.code).toEqual(expect.stringContaining('const test = {'))
  expect(transformed.code).toEqual(expect.stringContaining('package.json'))
  expect(transformed.code).toEqual(expect.stringContaining('}'))
})

it('should be able to read all json in a folder', () => {
  const instance: any = plugin()
  const matchedString = `const test = import.meta.intl(['vite-plugin-*/*']);`

  const transformed = instance.transform(matchedString, process.cwd())

  expect(transformed).toHaveProperty('code')
  expect(transformed.code).toEqual(expect.stringContaining('const test = {'))
  expect(transformed.code).toEqual(expect.stringContaining('package.json'))
  expect(transformed.code).toEqual(expect.stringContaining('}'))
})

it('should not have conflicting import keys', () => {
  const instance: any = plugin()
  const matchedString = `const package = import.meta.intl(['vite-plugin-*/package.json']);`

  const transformed = instance.transform(matchedString, process.cwd())

  expect(transformed).toHaveProperty('code')
  expect(transformed.code).not.toEqual(expect.stringContaining('import package'))
  expect(transformed.code).toEqual(expect.stringMatching(/import _.*\/package\.json';/))
  expect(transformed.code).toEqual(expect.stringContaining('package.json'))
})

it('should filter only json files', () => {
  const instance: any = plugin()
  const matchedString = `const package = import.meta.intl('vite-plugin-*/*');`

  const transformed = instance.transform(matchedString, process.cwd())

  expect(transformed).toHaveProperty('code')
  expect(transformed.code).not.toEqual(expect.stringMatching(/import _.*\/(?!.*\.json)/))
})

it('should filter out empty files', () => {
  const instance: any = plugin()
  const matchedString = `const package = import.meta.intl('vite-plugin-*/**/empty.json');`

  const transformed = instance.transform(matchedString, process.cwd())

  expect(transformed).toHaveProperty('code')
  expect(transformed.code).not.toEqual(expect.stringMatching(/import _.*\/empty\.json';/))
})
