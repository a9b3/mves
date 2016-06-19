import 'babel-polyfill'
import should from 'should'
import * as pathfinder from '../src/pathfinder.js'

describe('pathfinder', () => {

  /**
   * From
   *
   * - foo/
   *   - bar/
   *     - foo.js
   *     - bar.js
   *
   * To
   *
   * - foo/
   *   - bar.js
   *   - bar/
   *     - foo.js
   */
  it('refactorPath', async () => {
    const inputPath = './foo.js'
    const inputFile = '/foo/bar/bar.js'
    const changedFile = '/foo/bar.js'
    const refactoredPath = pathfinder.refactorPath({
      inputPath,
      inputFile,
      changedFile,
    })
    should.exist(refactoredPath)
    refactoredPath.should.equal('./bar/bar.js')
  })

})
