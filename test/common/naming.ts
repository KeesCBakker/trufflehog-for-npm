import path, { basename } from "path"

export function inferTestName(): string {
  // Create an Error object to inspect the stack and get the caller's filename
  const stack = new Error().stack!

  // Split the stack into lines and pick the appropriate one for the caller
  const callerStackLine = stack.split("\n")[2]

  // Extract the file path from the stack line
  const callerFilePathMatch = callerStackLine.match(/\((.*):\d+:\d+\)$/)
  if (!callerFilePathMatch) {
    throw new Error("Could not determine the caller file path from the stack.")
  }

  const callerFilePath = callerFilePathMatch[1]
  const dirName = path.dirname(callerFilePath)
  const fileName = path.basename(callerFilePath)

  const testRoot = path.resolve(__dirname, "..")
  const relativeDir = path.relative(testRoot, dirName)

  const testFile = basename(fileName, path.extname(fileName))

  return path.join(relativeDir, testFile)
}
