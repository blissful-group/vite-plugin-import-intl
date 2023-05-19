# vite-plugin-import-intl
A simple intl globbing import package for Vite

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