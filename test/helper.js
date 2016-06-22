import path from 'path'
import { exec } from 'child_process'

export function execPromise(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error)
        return
      }
      if (stderr) {
        reject(stderr)
        return
      }
      if (stdout) {
        resolve(stdout)
        return
      }
      resolve()
    })
  })
}

export async function setupDirectories() {
  const testDir = path.resolve(__dirname, './_testdir')
  const outputDir = path.resolve(__dirname, './testdir')
  await execPromise(`cp -r ${testDir} ${outputDir}`)
}

export async function removeDirectories() {
  const outputDir = path.resolve(__dirname, './testdir')
  await execPromise(`rm -rf ${outputDir}`)
}
