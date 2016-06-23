import should from 'should'
import path from 'path'
import * as helper from './helper.js'
import {
  fileExists,
} from '../src/helper.js'
import { moveAndRefactor } from '../src/index.js'

describe('main cli', () => {

  describe('moveAndRefactor', () => {
    const testDirName = 'testdir'
    const testDir = path.resolve(__dirname, testDirName)
    beforeEach(done => {
      helper.setupDirectories(testDir)
      .then(() => {
        done()
      })
      .catch(done)
    })

    afterEach(done => {
      helper.removeDirectories(testDir)
      .then(() => {
        done()
      })
      .catch(done)
    })

    it('moving importer file, imports should resolve', async () => {
      const input = path.resolve(testDir, 'src')
      const output = path.resolve(testDir, 'foo')
      await moveAndRefactor({
        input,
        output,
      })
      fileExists(output).should.equal(true)
      fileExists(path.resolve(output, 'index.js')).should.equal(true)
      const testModule = require(path.resolve(output, 'index.js'))
      should.exist(testModule.foo)
      testModule.foo.name.should.equal('foo')
    })

    it('moving a module, files importing should still be ok', async () => {
      const input = path.resolve(testDir, 'modules', 'foo')
      const output = path.resolve(testDir, 'bar')
      await moveAndRefactor({
        input,
        output,
      })
      fileExists(output).should.equal(true)
      fileExists(path.resolve(output, 'index.js')).should.equal(true)
      fileExists(path.resolve(testDir, 'src', 'index.js')).should.equal(true)

      const testModule = require(path.resolve(testDir, 'src', 'index.js'))
      testModule.foo.name.should.equal('foo')
    })

    it('moving a directory of modules, importer should still work', async () => {
      const input = path.resolve(testDir, 'modules')
      const output = path.resolve(testDir, 'zed')
      await moveAndRefactor({
        input,
        output,
      })
      fileExists(output).should.equal(true)

      const testModule = require(path.resolve(testDir, 'src', 'index.js'))
      testModule.foo.name.should.equal('foo')
      testModule.one.name.should.equal('one')
      testModule.two.name.should.equal('two')
    })
  })
})
