import { packages, rootDir, packagesDir } from './const'
import mustache from 'mustache'
import { readFileSync, readJsonSync, writeFileSync, writeJsonSync, copyFileSync } from 'fs-extra'
import { join } from 'path'
import { camelCase } from 'lodash-es'

// add README.md for each plugin
packages.forEach((p) => {
  const name = p.split('-').slice(2).join('-')
  const plainText = readFileSync(join(rootDir, 'scripts/plugin-template.md'), 'utf-8')

  const result = mustache.render(plainText, {
    name,
    importedName: camelCase(name),
    desc: readJsonSync(join(packagesDir, p, 'package.json')).description
  })
  writeFileSync(join(packagesDir, p, 'README.md'), result)
})

packages.forEach((p) => {
  // license
  copyFileSync(join(rootDir, 'LICENSE'), join(packagesDir, p, 'LICENSE'))

  // package.json
  const pkgPath = join(packagesDir, p, 'package.json')
  const pkg = readJsonSync(pkgPath)
  pkg.repository = {
    type: 'git',
    url: 'https://github.com/ZiuChen/bytemd-plugin.git',
    directory: `packages/${p}`
  }

  pkg.types = './dist/index.d.ts'
  pkg.module = './dist/index.mjs'
  pkg.main = './dist/index.js'
  pkg.unpkg = './dist/index.umd.js'
  pkg.jsdelivr = './dist/index.umd.js'

  pkg.exports = {
    '.': {
      types: './dist/index.d.ts',
      import: './dist/index.mjs',
      require: './dist/index.js'
    },
    './locales/*': './locales/*'
  }
  pkg.files = ['dist', 'locales']

  writeJsonSync(pkgPath, pkg)
})
