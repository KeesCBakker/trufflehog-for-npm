import { Command, Option } from "commander"
import {
  echoTrufflehogVersion,
  scanDirectoryWithTrufflehog
} from "../shell/trufflehog/runner"
import { executeNpmPack } from "../shell/npm"
import {
  out,
  signalNoSecretsFound,
  signalSecretsFoundBanner,
  title
} from "../console"
import { unpack } from "../tarring"

export function addScanCommand(program: Command) {
  program
    .command("scan")
    .addOption(new Option("-s, --silent", "generates no ouput").default(false))
    .addOption(
      new Option(
        "-d, --unpack-directory <dir>",
        "directory to use for unpacking"
      ).default("")
    )
    .addOption(
      new Option(
        "-k, --keep-unpack-directory",
        "directory to use for unpacking"
      ).default(false)
    )
    .description(
      "Packs the current NPM package and scans the result with trufflehog."
    )
    .action(async options => {
      title("Packing NPM", options.silent)
      let tarball: string

      try {
        tarball = await executeNpmPack(options.silent)
      } catch (ex) {
        out(ex.message)
        process.exit(404)
      }

      title("Unpack tarball", options.silent)
      const unpackResult = await unpack(
        tarball,
        options.unpackDirectory,
        options.keepUnpackDirectory
      )

      if (!options.silent) {
        out("Tarbal:  ", unpackResult.file)
        out("Unpacked:", unpackResult.directory)
        out("Keep:    ", options.keepUnpackDirectory)
      }

      title("Execute trufflehog", options.silent)
      if (!options.silent) {
        await echoTrufflehogVersion()
      }

      try {
        await scanDirectoryWithTrufflehog(
          unpackResult.directory,
          options.silent
        )
        signalNoSecretsFound(options.silent)
      } catch (ex) {
        signalSecretsFoundBanner(options.silent)
        throw ex
      }

      await unpackResult.cleanUp()
    })
}
