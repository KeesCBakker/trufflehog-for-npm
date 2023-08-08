import * as fs from "fs"
import * as os from "os"
import * as path from "path"
import * as tar from "tar"
import chalk from "chalk"
import commandExists from "command-exists"
import fetch from "node-fetch"
import { Octokit } from "@octokit/rest"
import { rimrafSync } from "rimraf"
import { out } from "../../console"

function getTrufflehogBinPath() {
  let bin = path.join(__dirname, "downloads", "trufflehog")
  if (getPlatformString().includes("window")) {
    bin += ".exe"
  }
  return bin
}

export async function ensureTrufflehogBin(silent: boolean) {
  try {
    if (await commandExists("trufflehog")) {
      return "trufflehog"
    }
  } catch {
    // no trufflehog in path, continue
  }

  let truffleHogExecPath = getTrufflehogBinPath()
  if (!fs.existsSync(truffleHogExecPath)) {
    await downloadTruffleHog(silent)
  }

  return truffleHogExecPath
}

export async function refreshTrufflehogDownload(silent: boolean) {
  let bin = path.join(__dirname, "downloads")
  rimrafSync(bin, { maxRetries: 5, retryDelay: 1 })
  await ensureTrufflehogBin(silent)
}

async function getTruffleHogReleaseURL(): Promise<string> {
  const octokit = new Octokit()
  const { data: release } = await octokit.repos.getLatestRelease({
    owner: "trufflesecurity",
    repo: "trufflehog"
  })

  let platform = getPlatformString()

  // Find the correct asset based on the platform and architecture
  const asset = release.assets.find(asset => asset.name.includes(platform))

  if (!asset) {
    throw "Unsupported platform: " + platform
  }

  return asset!.browser_download_url
}

function getPlatformString() {
  // An object to map Node.js platform and architecture to those in your file names
  const platformArchMap = {
    darwin: "darwin",
    win32: "windows",
    linux: "linux",
    x64: "amd64",
    arm64: "arm64"
    // add other mappings if needed
  }

  // Get platform and architecture of current system
  let platform = os.platform()
  let arch = os.arch()

  // Map platform and architecture to those in your file names
  let mappedPlatform = platformArchMap[platform]
  let mappedArch = platformArchMap[arch]

  if (!mappedPlatform || !mappedArch) {
    throw new Error("Unsupported platform or architecture")
  }

  // Create a substring that should match one of the file names in your array
  return `${mappedPlatform}_${mappedArch}`
}

async function downloadTruffleHog(silent: boolean) {
  const destination = getTrufflehogBinPath()

  fs.mkdirSync(path.dirname(destination), { recursive: true })

  const url = await getTruffleHogReleaseURL()

  if (!silent) {
    out("Downloading trufflehog from:", chalk.yellow(url))
    out("")
  }

  const response = await fetch(url)

  return new Promise<void>((resolve, reject) => {
    const fileStream = fs.createWriteStream(destination)

    response.body.on("error", reject).pipe(fileStream)
    response.body.on("end", async () => {
      await tar.x({
        file: destination,
        cwd: path.dirname(destination)
      })

      resolve()
    })
  })
}
