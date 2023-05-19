# ![vite-plugin-import-intl](logo.png)

A simple intl globbing import package for Vite

[![Build Status][]](https://github.com/blissful-group/vite-plugin-import-intl/acs/workflows/main.workflow.yml)
[![Code Coverage][]](https://codecov.io/gh/blissful-group/vite-plugin-import-intl/branch/main)
[![Issues Open][]](https://github.com/blissful-group/vite-plugin-import-intl/issues)
[![Licenses][]](./LICENSE)
[![Bundle Size][]](https://bundlephobia.com/package/utall)
[![NPM][]](https://www.npmjs.com/package/utall)

[Build Status]: https://github.com/blissful-group/vite-plugin-import-intl/actions/workflows/main.workflow.yml/badge.svg
[Code Coverage]: https://img.shields.io/codecov/c/github/blissful-group/vite-plugin-import-intl
[Issues Open]: https://img.shields.io/github/issues/blissful-group/vite-plugin-import-intl
[Licenses]: https://img.shields.io/github/license/blissful-group/vite-plugin-import-intl
[Bundle Size]: https://img.shields.io/bundlephobia/min/utall
[NPM]: https://img.shields.io/npm/v/vite-plugin-import-intl

## Getting started
Install package
```bash
npm install -D vite-plugin-import-intl
```
```bash
yarn add -D vite-plugin-import-intl
```
```bash
pnpm add -D vite-plugin-import-intl
```

Add plugin to `vite.config`
```ts
// vite.config.ts
import importIntl from 'vite-plugin-import-intl'

export default defineConfig({
  plugins: [
    ...,
    importIntl(),
  ],
  ...
})

```
Add types to tsconfig.json (this provides import.meta.intl intellisense)
```jsonc
// tsconfig.json
{
  "compilerOptions": {
    "types": ["vite-plugin-import-intl/client"],
    ...
  },
}
```

## Usage
To use the plugin, just import a glob of a certain folder, file or array of said locations
```ts
// Example
const locales = import.meta.intl('./*.json') // All json files in current folder
const locales = import.meta.intl(['../intl', '../other/intl']) // All json files in the intl and other/intl folder one directory up
```