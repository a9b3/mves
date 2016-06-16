import packageJson from '../package.json'

export function usage() {
  console.log(`${packageJson.name} ${packageJson.version}`)
  console.log(``)
  console.log(`Usage: ${Object.keys(packageJson.bin)[0]} [OPTIONS] <INPUT> <OUTPUT>`)
  console.log(``)
  console.log(`Move js, style, images and updates path references in project directory`)
  console.log(``)
  console.log(`Options:`)
  console.log(``)
  console.log(`  -o    override output path if it exists`)
  console.log(``)
}

export function version() {
  console.log(`${packageJson.name} ${packageJson.version}`)
}
