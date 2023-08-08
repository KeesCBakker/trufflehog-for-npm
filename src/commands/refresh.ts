import { Command } from "commander"
import { refreshTrufflehogDownload } from "../shell/trufflehog/downloader"
import { echoTrufflehogVersion } from "../shell/trufflehog/runner"

export function addRefreshCommand(program: Command) {
  program
    .command("refresh")
    .description(
      "Remove the trufflehog download (if there is any) and downloads the latest version."
    )
    .action(async () => {
      await refreshTrufflehogDownload(false)
      await echoTrufflehogVersion()
    })
}
