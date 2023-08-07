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

The internal stack will run TypeScript on Node.js. The final package should run on just Node.js.

## Install

We're currently not on NPM, so you can install the package as follow:

```sh
# clone repo
git clone https://github.com/KeesCBakker/trufflehog-for-npm

# install dependencies
cd trufflehog-for-npm
npm install

# install package globally
npm run gi

# download trufflehog and show version
hog trufflehog version

```

## Usage

```txt
Usage: trufflehog-for-npm [options] [command]

Let's use trufflehog to scan you NPM package before it is published. No more 🔑🔑🔑 to NPM!

Options:
  -V, --version         output the version number
  -h, --help            display help for command

Commands:
  trufflehog [options]  Starts trufflehog with the specified parameters. If trufflehog is not in your path, it will be downloaded.
  scan                  Packs the current NPM package and scans the result with trufflehog.
  refresh               Remove the trufflehog download (if there is any) and downloads the latest version.
  pre-commit            Scans the staged files with trufflehog. Can be used in a pre-commit hook.
  help [command]        display help for command
```

## Todo

- [ ] Download new release if current release is older than x days
- [ ] Create CLI with options and help
- [ ] Write some test cases
- [x] Write install instructions
- [ ] Write production install instructions
- [ ] Add install to package command just like Husky
- [ ] Add dev container for cross env development
