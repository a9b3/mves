import { exec } from 'child_process'
import fs from 'fs'
import path from 'path'

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

export function isDirectory(filePath) {
  const lstat = fs.lstatSync(filePath)
  return lstat.isDirectory()
}

export function fileExists(file) {
  try {
    fs.accessSync(file, fs.F_OK)
    return true
  } catch (e) {
    return false
  }
}

async function getMatchedFilenames(projectDir, searchterm) {
  try {
    const res = await execPromise(`cd ${projectDir} && ag ${searchterm} -l`)
  } catch (e) {
    console.log('ERROR', e)
  }
  const filenames = res.split('\n')
  console.log('here', filenames)
}

export async function changeFilePathInProjectDir({
  input,
  output,
  projectDir,
}) {
  const filesnames = await getMatchedFilenames(projectDir, path.basename(input))
}
