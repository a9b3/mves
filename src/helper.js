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

function walkFileTree(node, fn) {
  if (!fileExists(node)) return
  if (isDirectory(node)) {
    const files = fs.readdirSync(node)
    return [].concat.apply([], files.map(file => walkFileTree(path.resolve(node, file), fn)))
  } else {
    return [ fn(node) ]
  }
}

export function mapFileTree(node, fn) {
  const results = walkFileTree(node, fn).filter(a => a)
  return [].concat.apply([], results)
}

// fn must return fileContent to be written back into file
export function modifyFile(file, fn) {
  const fileContent = fs.readFileSync(file, { encoding: 'utf8' })
  const modifiedContent = fn(fileContent)
  if (!modifiedContent || modifiedContent.constructor !== String) return
  fs.writeFileSync(file, modifiedContent, { encoding: 'utf8' })
}
