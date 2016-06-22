import should from 'should'
import path from 'path'
import * as pathfinder from '../src/pathfinder.js'
import * as helper from './helper.js'

describe('pathfinder', () => {
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

  describe('getImportPath', () => {

    it('css url', async () => {
      const cssUrl = `background-image: url(./foo);`
      const cssPath = pathfinder.getImportPath(cssUrl)
      should.exist(cssPath)
      cssPath.should.equal(`./foo`)
    })

    it('css import', async () => {
      const cssImport = `
      @import './foo'
      `
      const cssPath = pathfinder.getImportPath(cssImport)
      should.exist(cssPath)
      cssPath.should.equal(`./foo`)
    })

    it('require', async () => {
      const requireStatement = `const foo = require('./foo');`
      const requirePath = pathfinder.getImportPath(requireStatement)
      should.exist(requirePath)
      requirePath.should.equal('./foo')
    })

    it('import', async () => {
      const importStatement = `import foo from './foo'`
      const importPath = pathfinder.getImportPath(importStatement)
      should.exist(importPath)
      importPath.should.equal('./foo')
    })

    it('multiline import', async () => {
      const importStatement = `
      import {
        foo,
        bar,
      } from './foo'
      `.trim()
      const importPath = pathfinder.getImportPath(importStatement)
      should.exist(importPath)
      importPath.should.equal('./foo')
    })

  })

  describe('getMovedFilePaths', () => {
    it('if output is file return nothing', async () => {
      const input = path.resolve(__dirname, testDirName, 'modules')
      const output = path.resolve(__dirname, testDirName, 'src', 'index.js')
      const ret = pathfinder.getMovedFilePaths(input, output)
      should.exist(ret)
      ret.length.should.equal(0)
    })

    it('if input is a file and output doesnt exist create file', async () => {
      const input = path.resolve(__dirname, testDirName, 'src', 'index.js')
      const output = path.resolve(__dirname, testDirName, 'foo.js')
      const ret = pathfinder.getMovedFilePaths(input, output)
      should.exist(ret)
      ret.length.should.equal(1)
      const modifiedFile = ret[0]
      modifiedFile.original.should.equal(input)
      modifiedFile.changed.should.equal(output)
    })

    it('file input, output is dir should result in dir/file', async () => {
      const input = path.resolve(__dirname, testDirName, 'src', 'index.js')
      const output = path.resolve(__dirname, testDirName, 'modules')
      const ret = pathfinder.getMovedFilePaths(input, output)
      should.exist(ret)
      ret.length.should.equal(1)
      const modifiedFile = ret[0]
      modifiedFile.original.should.equal(input)
      modifiedFile.changed.should.equal(path.resolve(output, path.basename(input)))
    })
  })

})
