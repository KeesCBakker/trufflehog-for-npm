import { Command } from "commander"
import { echoTruggleHogVersion, executeTruffleHog } from "../trufflehog/runner"
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
      const details = await unpack(tarball)

      console.log("Tarbal:  ", tarball)
      console.log("Unpacked:", details.directory)

      title("Execute trufflehog")
      await echoTruggleHogVersion()

      try {
        await executeTruffleHog(details.directory, details.file)
        signalNoSecretsFound()
      } catch {
        signalSecretsFoundBanner()
        process.exit(138)
      }

      await details.cleanUp()
    })
}
