import { readdirSync } from 'fs'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

export const rootDir = resolve(__dirname, '..')
export const packagesDir = resolve(__dirname, '../packages')
export const packages = readdirSync(packagesDir).filter(
  (name) => !(name.startsWith('.') || name.startsWith('_')) && name !== 'preview'
) // ignore file like .DS_Store on macOS
