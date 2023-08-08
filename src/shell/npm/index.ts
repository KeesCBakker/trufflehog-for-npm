import fs from "fs"
import path from "path"
import { cwd } from "process"
import { executeShell } from ".."

export async function executeNpmPack(silent: boolean) {
  const npm = process.platform === "win32" ? "npm.cmd" : "npm"
  const packagePath = path.join(cwd(), "package.json")

  if (!fs.existsSync(packagePath)) {
    throw new Error(
      "No package.json found in directory. Can only run scan for NPM packages."
    )
  }

  let packageJsonFileContents = fs.readFileSync(packagePath).toString()
  let packageJson = JSON.parse(packageJsonFileContents)
  let packageName = `${packageJson.name}-${packageJson.version}.tgz`

  await executeShell("npm", ["pack"], silent)

  return packageName
}
