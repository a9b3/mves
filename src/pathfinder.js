import path from 'path'

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
  return importModuleRelativeFromChangedFile
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
  return modifiedImportStatement
}
