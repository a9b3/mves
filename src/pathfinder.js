import fs from 'fs'
import path from 'path'
import * as helper from './helper.js'

/**
 * Return an array of paths that represents filepaths if a mv operation were to
 * occur.
 *
 * @param {String} input - absolute path for first argument supplied to mv
 * @param {String} output - absolute path for output argument supplied to mv
 * @returns {Array<Object>}
 * [ { original: string, changed: string } ]
 */
export function getMovedFilePaths(input, output) {
  // if output is a file no move operation will be done
  if (helper.fileExists(output) && !helper.isDirectory(output)) {
    return []
  }

  // if output doesnt exists and input is a file
  // always create a file
  if (!helper.fileExists(output) && !helper.isDirectory(input)) {
    return [
      {
        original: input,
        changed: output,
      },
    ]
  }

  const subtractRoot = helper.fileExists(output)
    ? input.replace(path.basename(input), '')
    : `${input}/`

  const results = helper.mapFileTree(input, filePath => {
    const pathDiff = filePath.replace(subtractRoot, '')
    return {
      original: filePath,
      changed: path.resolve(output, pathDiff),
    }
  })
  return results
}

/**
 * A file importing other files changed locations. Refactor import/require
 * statements to be accurate with existing modules relative to changed file
 * location.
 *
 * @param {String} importStatement - a relative path
 * @param {String} originalLocation - absolute path
 * @param {String} changedLocation - absolute path
 * @returns {String} relative path
 */
export function importerRefactor({
  importStatement,
  originalLocation,
  changedLocation,
}) {
  const importModuleAbsolutePath = path.resolve(originalLocation, '..', importStatement)
  const tempNodes = path.relative(changedLocation, importModuleAbsolutePath)
  .split('/')
  tempNodes.shift()
  const importModuleRelativeFromChangedFile = tempNodes.join('/')

  if (!/^\.\.\//.test(importModuleRelativeFromChangedFile)) {
    return `./${importModuleRelativeFromChangedFile}`
  } else {
    return importModuleRelativeFromChangedFile
  }
}

/**
 * A file that is imported by other files changed locations, Refactor
 * import/require statement from existing importer file location relatived to
 * changed module location.
 *
 * @param {String} importerLocation - absolute path
 * @param {String} changedLocation - absolute path
 * @returns {String} relative path
 */
export function importRefactor({
  importerLocation,
  changedLocation,
}) {
  const tempNodes = path.relative(importerLocation, changedLocation)
  .split('/')
  tempNodes.shift()
  const modifiedImportStatement = tempNodes.join('/')

  if (!/^\.\.\//.test(modifiedImportStatement)) {
    return `./${modifiedImportStatement}`
  } else {
    return modifiedImportStatement
  }
}

/**
 * Gets import path from a string.
 * eg.
 *  import foo from '../foo'
 *  should return
 *  ../foo
 *
 * @param {String} str - a string to extract just the path out
 * @param {String=} keyword - optional keyword to search for
 * @returns {String} path extracted from str
 */
export function getImportPath(str, keyword = '.*') {
  const regexpTest = new RegExp(`((import|require|from).('|"))(\.+\/${keyword})('|")`)
  const firstMatch = str.match(regexpTest)
  if (firstMatch) {
    return firstMatch[4]
  }

  const parenTest = new RegExp(`(url\\()(\.+\/${keyword})\\)`)
  const secondMatch = str.match(parenTest)
  if (secondMatch) {
    return secondMatch[2]
  }
}

/**
 * Refactor all import statements inside a file relative to it's changed
 * location.
 *
 * @param {String} original - absolute path to original location
 * @param {String} changed - absolute path to moved location
 * @returns {null} no returns
 */
export function refactorImportsInFile({
  original,
  changed,
  log = true,
}) {
  helper.modifyFile(changed, fileContent => {
    const lines = fileContent.split('\n')
    const modified = lines.map((line, i) => {
      const importPath = getImportPath(line)
      if (!importPath) return line

      const refactoredImportPath = importerRefactor({
        importStatement: importPath,
        originalLocation: original,
        changedLocation: changed,
      })
      const refactoredLine = line.replace(importPath, refactoredImportPath)

      if (log && env !== 'test') console.log(`${changed} line ${i}: ${refactoredLine}`)

      return refactoredLine
    })
    .join('\n')
    return modified
  })
}

// refactoring import of a module in an importer file
export function refactorImportInImporter({
  importerLocation,
  matchedLines,
  changedModuleLocation,
  log = true,
}) {
  helper.modifyFile(importerLocation, fileContent => {
    const lines = fileContent.split('\n')
    matchedLines.forEach(i => {
      const importPath = getImportPath(lines[i])
      const refactoredImportPath = importRefactor({
        importerLocation,
        changedLocation: changedModuleLocation,
      })
      const refactoredLine = lines[i].replace(importPath, refactoredImportPath)
      lines[i] = refactoredLine

      if (log && env !== 'test') console.log(`${importerLocation} line ${i}: ${refactoredLine}`)
    })
    return lines.join('\n')
  })
}

/**
 * Get file paths that import the given module path.
 *
 * @param {String} originalModulePath - absolute path to module
 * @param {String=} scope - absolute path of scope for search
 * @returns {Array<String>} array of absolute paths
 */
export async function getFilenamesImportingModule(originalModulePath, scope) {
  try {
    let searchScope
    if (scope) {
      searchScope = scope
    } else {
      const gitRes = await helper.execPromise(`git rev-parse --show-toplevel`)
      searchScope = gitRes.trim()
    }
    const searchTerm = path.basename(originalModulePath)
    const agRes = await helper.execPromise(`ag \\\(require\\\|from\\\)\\\.\\\*${searchTerm} ${searchScope} -l`)

    const files = agRes.trim().split('\n')
    return files
    .map(file => path.resolve(file))
    .map(file => {
      const fileContent = fs.readFileSync(file, { encoding: 'utf8' })
      const lines = fileContent.split('\n')

      const matchedLines = lines.map((line, i) => {
        const importPath = getImportPath(line, searchTerm)
        if (!importPath) return false
        // extra .. to back out of the 'file'
        const importAbsolutePath = path.resolve(file, '..', importPath)

        // make sure the file was importing the same module
        if (importAbsolutePath === originalModulePath) {
          return i
        }
        return false
      })
      .filter(a => a !== false)

      return matchedLines.length === 0
        ? false
        :
        {
          filepath: file,
          matchedLines,
        }
    })
    .filter(a => a)

  } catch (e) {
    return []
  }
}
