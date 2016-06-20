# mves (not published yet)

[![Build Status](https://travis-ci.org/esayemm/mves.svg?branch=master)](https://travis-ci.org/esayemm/mves)

mv ecmascript

mv anything that can be imported by js and have mves automatically resolve import/require statements

## Installation

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
