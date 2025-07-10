import { globSync } from 'node:fs'
import { spawn } from 'node:child_process'

const packages = globSync('packages/*')

const buildPromises = packages
  .filter((pkg) => {
    // Filter out packages that start with "bytemd-plugin-"
    return pkg.includes('bytemd-plugin-')
  })
  .map((pkg) => {
    return new Promise<void>((resolve, reject) => {
      const child = spawn('pnpm', ['build'], { cwd: pkg, stdio: 'inherit' })
      child.on('close', (code) => {
        if (code === 0) {
          resolve()
        } else {
          reject(new Error(`Build failed for ${pkg}`))
        }
      })
    })
  })

Promise.all(buildPromises)
  .then(() => {
    console.log('All packages built successfully.')
  })
  .catch((error) => {
    console.error('Error building packages:', error)
    process.exit(1)
  })
