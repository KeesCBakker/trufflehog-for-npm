import { ensureTrufflehogBin } from "./downloader"
import { spawn } from "child_process"

export async function executeTrufflehog(args: string[]) {
  const truffleHogPath = await ensureTrufflehogBin()

  return new Promise<void>((resolve, reject) => {
    const trufflehog = spawn(truffleHogPath, args, {
      stdio: "inherit",
      shell: true
    })

    trufflehog.on("close", code => {
      if (code !== 0) {
        reject(new Error("trufflehog failed with error code: " + code))
      } else {
        resolve()
      }
    })
  })
}

export async function echoTrufflehogVersion() {
  await executeTrufflehog(["--version"])
}

export async function scanDirectoryWithTrufflehog(directory: string) {
  // Escape backslashes in the directory string
  const escapedDirectory = directory.replace(/\\/g, "\\\\")
  await executeTrufflehog(["filesystem", escapedDirectory, "--fail"])
}

export async function scanPreCommitWithTrufflehog() {
  await executeTrufflehog([
    "git",
    "file://.",
    "--since-commit",
    "HEAD",
    "--fail"
  ])
}
