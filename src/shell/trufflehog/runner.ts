import { executeShell } from ".."
import { ensureTrufflehogBin } from "./downloader"

export async function executeTrufflehog(args: string[], silent: boolean) {
  const truffleHogPath = await ensureTrufflehogBin(silent)
  await executeShell(truffleHogPath, args)
}

export async function echoTrufflehogVersion(silent: boolean = false) {
  await executeTrufflehog(["--version"], silent)
}

export async function scanDirectoryWithTrufflehog(
  directory: string,
  silent: boolean,
  extraArguments: string[] = []
) {
  // Escape backslashes in the directory string
  const escapedDirectory = directory.replace(/\\/g, "\\\\")
  const theArguments = ["filesystem", escapedDirectory, "--fail"].concat(
    extraArguments || []
  )
  await executeTrufflehog(theArguments, silent)
}

export async function scanPreCommitWithTrufflehog(silent: boolean = false) {
  await executeTrufflehog(
    ["git", "file://.", "--since-commit", "HEAD", "--fail"],
    silent
  )
}
