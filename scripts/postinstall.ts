import { packages, rootDir, packagesDir } from './const'
import mustache from 'mustache'
import { readFileSync, readJsonSync, writeFileSync } from 'fs-extra'
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
