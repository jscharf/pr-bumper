#!/usr/bin/env node

'use strict'

require('../lib/typedefs')
const program = require('commander')
const pkgJson = require('../package.json')
const lib = require('../lib')

let cmd = ''

program
  .version(pkgJson.version)
  .option('-o, --owner [value]', 'The repository owner/project')
  .option('-r, --repo [value]', 'The repository name')

program
  .command('bump')
  .action(() => {
    cmd = 'bump'
  })

program
  .command('check')
  .action(() => {
    cmd = 'check'
  })

program.parse(process.argv)

let travisOwner
let travisRepo
if (process.env.TRAVIS_SLUG) {
  const parts = process.env.TRAVIS_SLUG.split('/')
  travisOwner = parts[0]
  travisRepo = parts[1]
}

const owner = program.owner || travisOwner
const repo = program.repo || travisRepo

const vcs = new lib.GitHub(owner, repo)
const bumper = new lib.Bumper(vcs)

switch (cmd) {
  case 'bump':
    bumper.getMergedPrScope()
      .then((scope) => {
        console.log(`Applying a ${scope} bump (except it's not implemente yet)`)
      })
      .catch((error) => {
        console.log(error.message)
        process.exit(1)
      })
    break
  case 'check':
    bumper.getOpenPrScope()
      .then((scope) => {
        console.log(`Found a ${scope} bump for the current PR`)
      })
      .catch((error) => {
        console.log(error.message)
        process.exit(1)
      })
    break
  default:
    program.help()
    break
}
