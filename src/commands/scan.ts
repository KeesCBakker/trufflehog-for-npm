import { Command } from "commander"
import {
  echoTrufflehogVersion,
  scanDirectoryWithTrufflehog
} from "../trufflehog/runner"
import { executeNpmPack } from "../npm"
import {
  signalNoSecretsFound,
  signalSecretsFoundBanner,
  title
} from "../console"
import { unpack } from "../tarring"

export function addScanCommand(program: Command) {
  program
    .command("scan")
    .description(
      "Packs the current NPM package and scans the result with trufflehog."
    )
    .action(async () => {
      title("Packing NPM")
      let tarball: string

      try {
        tarball = await executeNpmPack()
      } catch (ex) {
        console.log(ex.message)
        process.exit(404)
      }

      title("Unpack tarball")
      const unpackResult = await unpack(tarball)

      console.log("Tarbal:  ", unpackResult.file)
      console.log("Unpacked:", unpackResult.directory)

      title("Execute trufflehog")
      await echoTrufflehogVersion()

      try {
        await scanDirectoryWithTrufflehog(unpackResult.directory)
        signalNoSecretsFound()
      } catch {
        signalSecretsFoundBanner()
        process.exit(138)
      }

      await unpackResult.cleanUp()
    })
}
