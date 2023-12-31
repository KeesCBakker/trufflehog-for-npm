import fs from "fs"
import path from "path"

function findPackageJson(startPath: string) {
  let filePath: string
  let currentPath = startPath

  do {
    filePath = path.join(currentPath, "package.json")
    if (fs.existsSync(filePath)) {
      return filePath
    }
    currentPath = path.join(currentPath, "..")
  } while (currentPath !== path.parse(currentPath).root)

  throw new Error("package.json not found")
}

export function getPackageDetails() {
  const packageJsonPath = findPackageJson(__dirname)
  const packageJsonContents = fs.readFileSync(packageJsonPath)?.toString()
  const packageJson = JSON.parse(packageJsonContents)

  return {
    name: packageJson.name as string,
    version: packageJson.version as string,
    description: packageJson.description as string
  }
}

export function getPackagRoot() {
  return findProjectRoot()
}

function findProjectRoot(currentDir: string = __dirname): string {
  if (fs.existsSync(path.join(currentDir, "package.json"))) {
    return currentDir
  }

  const parentDir = path.dirname(currentDir)
  if (parentDir === currentDir) {
    throw new Error("Cannot find project root. No package.json found.")
  }

  return findProjectRoot(parentDir)
}
