# mves

[![Build Status](https://travis-ci.org/esayemm/mves.svg?branch=master)](https://travis-ci.org/esayemm/mves)
[![npm version](https://badge.fury.io/js/mves.svg)](https://badge.fury.io/js/mves)

mv ecmascript

mv anything that can be imported by js and have mves automatically resolve import/require statements. This works for js, jsx, scss, css and supports import, require, url statements.

## Installation

Requires `ag` and `git`, both of which can be installed via `brew`.

```sh
npm i -g mves
```

## Usage

```sh
# example
mves <input> <output>
```

Example.

Let's say you have this folder structure, and one.js imports two.js the import statement would look something like `import two from '../two/two.js'`

```sh
.
├── one
│   └── one.js
└── two
    └── two.js
```

After running

```sh
mves one/one.js one.js
```

Your folder structure now looks like this

```sh
.
├── one
├── one.js
└── two
    └── two.js
```

and that import statement now looks like this `import two from './two/two.js'`

## Todo

- support `import foo from './foo'` foo could potentially be `foo.js` or `foo/index.js` right now it only supports `import foo from './foo.js`'

- better logging for user, right now it prints absolute path of modified file, nicer to print relative to project root or specified scope.

- support multiple input args just like mv for ex. `mv foo bar zed dir` will move foo bar and zed into dir