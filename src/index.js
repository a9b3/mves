const argv = require('yargs').argv
import * as commands from './commands.js'
import {
  execPromise,
  isDirectory,
  fileExists,
} from './helper.js'
import * as pathfinder from './pathfinder.js'
import path from 'path'

async function main() {
  const command = argv._[0]

  // check for deps, ag and git
  await execPromise(`type ag >/dev/null 2>&1 || { echo >&2 "Requires ag 'brew install ag'"; }`)
  await execPromise(`type git >/dev/null 2>&1 || { echo >&2 "Requires git 'brew install git'"; }`)

  // help/version stuff
  if (argv.v || argv.version || ~[ 'version', 'v' ].indexOf(command)) {
    commands.version()
    return
  } else if (argv.help || argv.h || ~[ 'help', 'h' ].indexOf(command)) {
    commands.usage()
    return
  }

  if (argv._.length < 2) throw new Error(`Not enough arguments provided`)

  // extract args
  const input = path.resolve('.', argv._[0])
  const output = path.resolve('.', argv._[argv._.length - 1])

  // error handling
  if (!input || !output) throw new Error(`Must provide input and output`)
  if (!fileExists(input)) throw new Error(`${argv._[0]} is not a valid file path`)
  if (fileExists(output) && !isDirectory(output) && !argv.o) {
    throw new Error(`${argv._[1]} already exists use -o option to overwrite`)
  }

  await pathfinder.moveAndRefactor({
    input,
    output,
  })
}

// wrapper to catch errors lol
async function asyncWrapper(fn) {
  try {
    await fn()
  } catch (e) {
    console.log('ERROR:', e.message)
  }
}
asyncWrapper(main)
