import { ensureTruffleHog } from "./downloader"
import { spawn } from "child_process"

export async function executeTruffleHog(directory: string, tarball: string) {
  // Escape backslashes in the directory string
  const escapedDirectory = directory.replace(/\\/g, "\\\\")

  await start(["filesystem", escapedDirectory, "--fail"])
}

export async function start(args: string[]) {
  const truffleHogPath = await ensureTruffleHog()

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

export async function echoTruggleHogVersion() {
  await start(["--version"])
}
