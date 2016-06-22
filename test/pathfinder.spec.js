import should from 'should'
import * as pathfinder from '../src/pathfinder.js'
import * as helper from './helper.js'

describe('pathfinder', () => {
  before(done => {
    helper.setupDirectories()
    .then(() => {
      done()
    })
    .catch(done)
  })

  after(done => {
    helper.removeDirectories()
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

})
