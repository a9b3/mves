const argv = require('yargs').argv
import * as commands from './commands.js'
import {
  execPromise,
  isDirectory,
  fileExists,
} from './helper.js'
import * as pathfinder from './pathfinder.js'
import path from 'path'

export async function moveAndRefactor({
  input,
  output,
}) {
  // compile array of { original, changed } objects
  // this will be used to resolve import statements after moving the files
  // need to be done before moving, to determine whether or not we're moving the
  // file into a directory or not
  const movedFilePaths = pathfinder.getMovedFilePaths(input, output)

  await execPromise(`mv ${input} ${output}`)

  // do the file path stuff
  // first resolve the moved files import statements
  const extWhitelist = /\.(js|jsx|css|scss)$/i
  movedFilePaths.forEach(movedFilePath => {
    if (!extWhitelist.test(path.extname(movedFilePath.changed))) return
    pathfinder.refactorImportsInFile(movedFilePath)
  })

  // refactor import statements for all files that imported the original input
  const promises = movedFilePaths.map(async (movedFilePath) => {
    const matchedFiles = await pathfinder.getFilenamesImportingModule(movedFilePath.original)
    return matchedFiles.map(matchedFile => {
      pathfinder.refactorImportInImporter({
        matchedLines: matchedFile.matchedLines,
        importerLocation: matchedFile.filepath,
        changedModuleLocation: movedFilePath.changed,
      })
    })
  })
  await Promise.all(promises)
}

async function main() {
  const command = argv._[0]

  // help/version stuff
  if (argv.v || argv.version || ~[ 'version', 'v' ].indexOf(command)) {
    commands.version()
    return
  } else if (argv.help || argv.h || ~[ 'help', 'h' ].indexOf(command)) {
    commands.usage()
    return
  }

  // extract args
  const input = path.resolve('.', argv._[0])
  const output = path.resolve('.', argv._[1])

  // error handling
  if (!input || !output) {
    console.log(`Must provide input and output`)
    return
  }
  if (!fileExists(input)) {
    console.log(`${argv._[0]} is not a valid file path`)
    return
  }
  if (fileExists(output) && !isDirectory(output) && !argv.o) {
    console.log(`${argv._[1]} already exists use -o option to overwrite`)
    return
  }

  await moveAndRefactor({
    input,
    output,
  })
}

try {
  main()
} catch (e) {
  console.log('ERROR', e)
}
