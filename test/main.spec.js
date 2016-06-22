import should from 'should'
import path from 'path'
import * as helper from './helper.js'
import { moveAndRefactor } from '../src/index.js'

describe('main cli', () => {
  const testDirName = 'testdir'
  const testDir = path.resolve(__dirname, testDirName)

  before(done => {
    helper.setupDirectories(testDir)
    .then(() => {
      done()
    })
    .catch(done)
  })

  after(done => {
    helper.removeDirectories(testDir)
    .then(() => {
      done()
    })
    .catch(done)
  })

  it('moveAndRefactor', async () => {
    const input = path.resolve(testDir, 'src')
    const output = path.resolve(testDir, 'foo')
    moveAndRefactor({
      input,
      output,
    })
  })
})
