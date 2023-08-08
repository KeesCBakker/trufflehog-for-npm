import fs from "fs"
import path from "path"
import { cwd } from "process"
import { executeShell } from ".."
import { getPackagRoot } from "../../meta"

function ensurePackageScope() {
  let packagePath = resolvePackageJson()
  if (!fs.existsSync(packagePath)) {
    throw new Error(
      "No package.json found in directory. Can only run scan for NPM packages."
    )
  }
}

export async function executeNpmPack() {
  await executeNpm(["pack"])

  let packagePath = resolvePackageJson()
  let packageJsonFileContents = fs.readFileSync(packagePath).toString()
  let packageJson = JSON.parse(packageJsonFileContents)
  let packageName = `${packageJson.name}-${packageJson.version}.tgz`

  return packageName
}

export async function executeNpmInstallMe() {
  await executeNpm(["install", getPackagRoot(), "--save-dev"])
}

export async function executeNpm(args: string[]) {
  ensurePackageScope()
  let npm = resolveNpmBin()
  await executeShell(npm, args)
}

function resolvePackageJson() {
  const packagePath = path.join(cwd(), "package.json")
  return packagePath
}

function resolveNpmBin() {
  return process.platform === "win32" ? "npm.cmd" : "npm"
}
