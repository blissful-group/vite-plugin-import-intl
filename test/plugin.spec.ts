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

it('should return on no transform matches', () => {
  const instance: any = plugin()

  expect(instance.transform('no match')).toEqual(undefined)
})

it('should throw on multiple transform matches', () => {
  const instance: any = plugin()
  const matchedString = "const test = import.meta.intl('./package.json');"

  expect(() => instance.transform(`${matchedString} ${matchedString}`)).toThrow()
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
