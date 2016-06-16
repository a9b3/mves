const argv = require('yargs').argv
import fs from 'fs'
import * as commands from './commands.js'

export function fileExists(file) {
  try {
    fs.accessSync(file, fs.F_OK)
    return true
  } catch (e) {
    return false
  }
}

function main() {
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
  const input = argv._[0]
  const output = argv._[1]

  if (!input || !output) {
    console.log(`Must provide input and output`)
    return
  }
  if (!fileExists(input)) {
    console.log(`${input} is not a valid file path`)
    return
  }
}

main()
