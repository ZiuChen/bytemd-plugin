// modified from bytemd/scripts/build.mjs
import { resolve } from 'path'
import { readJson, readJsonSync, existsSync } from 'fs-extra'
import { sync } from 'resolve'
import { build, LibraryFormats } from 'vite'
import viteDts from 'vite-plugin-dts'
import { viteStaticCopy } from 'vite-plugin-static-copy'

import { camelCase } from 'lodash-es'
import { packages, packagesDir } from './const'
;(async () => {
  for (let name of packages) {
    if (name === 'preview') return

    console.log('[building]', name)

    const root = resolve(packagesDir, name)
    process.chdir(root)

    // build js
    const pkg = await readJson(resolve(root, 'package.json'))

    for (let format of ['es', 'cjs', 'umd'] as LibraryFormats[]) {
      const legacy = format === 'umd' || format === 'iife'
      const externalDeps: string[] = []

      if (legacy) {
        externalDeps.push(...Object.keys({ ...pkg.peerDependencies }))
      } else if (format === 'es') {
        externalDeps.push(
          ...Object.keys({
            ...pkg.peerDependencies,
            ...pkg.dependencies
          })
        )
      } else if (format === 'cjs') {
        const deps = Object.keys({ ...pkg.dependencies })
          // exclude esm packages, bundle them to make it work for cjs
          .filter((dep) => {
            const pkgPath = resolve(root, 'node_modules', dep, 'package.json')

            if (!existsSync(pkgPath)) {
              throw new Error(`${dep} not exists, please install it`)
            }

            const { type: pkgType } = readJsonSync(pkgPath)
            return pkgType !== 'module'
          })

        externalDeps.push(...Object.keys({ ...pkg.peerDependencies }), ...deps)
      }

      const alias = {
        // https://github.com/rollup/plugins/issues/1159
        // for plugin-highlight-ssr
        lowlight: 'lowlight/lib/common'
      }

      if (format === 'cjs') {
        const pkgName = 'decode-named-character-reference'

        // do not resolve `browser` field to make CJS bundle work at SSR
        // https://github.com/vitejs/vite/issues/4405
        // for bytemd and plugin-gfm
        alias[pkgName] = sync(pkgName)
      }

      await build({
        root,
        build: {
          emptyOutDir: false,
          minify: legacy,
          target: 'es2019', // nullish coalescing in es2020
          lib: {
            entry: 'src/index.ts',
            name: camelCase(pkg.name),
            formats: [format],
            fileName: 'index'
          },
          rollupOptions: {
            external: [...externalDeps, ...externalDeps.map((dep) => new RegExp(`^${dep}\/`))]
          }
        },
        resolve: { alias },
        plugins: [
          viteDts(),
          viteStaticCopy({
            targets: [{ src: './README.md', dest: '.' }] // dest: relative to build.outDir
          })
        ]
      })
    }
  }
})()
