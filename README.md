# trufflehog-for-npm
Let's use trufflehog to scan you NPM package before it is published. No more 🔑🔑🔑 to NPM!

## Goals

Let's create something that:

- [ ] Can run on a `prePublish` hook in NPM
- [ ] Downloads the right version of trufflehog
- [ ] Scans the package that is about to be published
- [ ] And prevents publishing that package if a key is in it
- [ ] That runs on multiple platforms (Windows, Apple and Linux)

And that:
- [ ] Uses a Husky pre-commit hook
- [ ] to scan the current commit
- [ ] And prevents publishing that package if a key is in it

## Stack

The internal stack will run TypeScript on Node.js. The final package should run in JavaScript.
