# Trufflehog for NPM 🔑🐷

Let's use <a href="https://github.com/trufflesecurity/trufflehog">trufflehog</a> to scan your NPM package before it is published. No more 🔑🔑🔑 to NPM!

## Goals

Let's create something that:

- [ ] Can run on a `prePublish` hook in NPM
- [ ] Downloads the right version of trufflehog
- [ ] Scans the package that is about to be published
- [ ] And prevents publishing that package if a key is in it
- [ ] That runs on multiple platforms (Windows, Apple and Linux)

And that:

- [ ] Uses a <a href="https://www.npmjs.com/package/husky">Husky</a> pre-commit hook
- [ ] to scan the current commit
- [ ] And prevents publishing that package if a key is in it

## Stack

The internal stack will run TypeScript on Node.js. The final package should run in JavaScript.

## Todo

- [ ] Download new release if current release is older than x days
- [ ] Create CLI with options and help
- [ ] Write some test cases
- [ ] Write install instructions
