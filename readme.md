# CLI kit
Boilerplate for starting an es6 node cli project.

##Prerequisite
Have [starter-deck-cli](https://github.com/esayemm/starter-deck-cli) installed
globally.

##Installation
```sh
sdcli save cli https://github.com/esayemm/starter-deck_cli-kit
```
<hr>
##Development
####Publish a release
Use [npm version](https://docs.npmjs.com/cli/version) and follow [semver](http://semver.org/) rules.<br>

```
npm version [ major | minor | patch ]
```

1. bumps package version
2. creates git tag
3. push tag
4. builds
5. npm publish

####Test without publishing
Use [npm link](https://docs.npmjs.com/cli/link).

```
npm link
```