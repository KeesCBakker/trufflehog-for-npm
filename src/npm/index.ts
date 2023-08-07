import fs from "fs"
import path from "path"
import { cwd } from "process"
import { spawn } from "child_process"

export function executeNpmPack() {
  const npm = process.platform === "win32" ? "npm.cmd" : "npm"
  const packagePath = path.join(cwd(), "package.json")

  if (!fs.existsSync(packagePath)) {
    throw new Error(
      "No package.json found in directory. Can only run scan for NPM packages."
    )
  }

  return new Promise<string>((resolve, reject) => {
    let packageJsonFileContents = fs.readFileSync(packagePath).toString()
    let packageJson = JSON.parse(packageJsonFileContents)
    let packageName = `${packageJson.name}-${packageJson.version}.tgz`

    const npmPack = spawn(npm, ["pack"], { stdio: "inherit", shell: true })

    npmPack.on("close", code => {
      if (code !== 0) {
        reject(new Error(`"npm pack" failed with code ${code}`))
      } else {
        resolve(packageName)
      }
    })
  })
}
