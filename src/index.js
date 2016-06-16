const argv = require('yargs').argv
import fs from 'fs'
import * as commands from './commands.js'
import { execPromise, isDirectory, fileExists } from './helper.js'
import path from 'path'

async function main() {
  const command = argv._[0]

  // help/version stuff
  if (argv.v || argv.version || ~['version', 'v'].indexOf(command))  {
    commands.version()
    return
  } else if (argv.help || argv.h || ~['help', 'h'].indexOf(command)) {
    commands.usage()
    return
  }

  // mv logic
  const input = path.resolve('.', argv._[0])
  const output = path.resolve('.', argv._[1])

  if (!input || !output) {
    console.log(`Must provide input and output`)
    return
  }
  if (!fileExists(input)) {
    console.log(`${argv._[0]} is not a valid file path`)
    return
  }
  if ((fileExists(output) && !isDirectory(output)) && !argv.o) {
    console.log(`${argv._[1]} already exists use -o option to overwrite`)
    return
  }

  const mvRes = await execPromise(`mv ${input} ${output}`)
  try {
    const projectDir = await execPromise(`git rev-parse --show-toplevel`)
    console.log(`projectDir`, projectDir)
  } catch (e) {
    console.log('ERROR', e)
  }
}

main()
