import should from 'should'
import path from 'path'
import * as pathfinder from '../src/pathfinder.js'

describe('pathfinder', () => {

  it('importerRefactor', async () => {
    const importStatement = '../two/foo-module.js'
    const originalLocation = path.resolve(__dirname, './foo/one/test.js')
    const changedLocation = path.resolve(__dirname, './foo/three/four/test.js')

    const refactoredPath = pathfinder.importerRefactor({
      importStatement,
      originalLocation,
      changedLocation,
    })
    should.exist(refactoredPath)
    refactoredPath.should.equal('../../two/foo-module.js')
  })

  it('importRefactor', async () => {
    const importerLocation = path.resolve(__dirname, './foo/one/test.js')
    const changedLocation = path.resolve(__dirname, './foo/two/test.js')

    const refactoredImportStatement = pathfinder.importRefactor({
      importerLocation,
      changedLocation,
    })
    should.exist(refactoredImportStatement)
    refactoredImportStatement.should.equal('../two/test.js')
  })

})
