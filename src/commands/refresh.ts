import { Command } from "commander"
import { refreshHogDownload } from "../trufflehog/downloader"
import { echoTruggleHogVersion } from "../trufflehog/runner"

export function addRefreshCommand(program: Command) {
  program
    .command("refresh")
    .description(
      "Remove the trufflehog download (if there is any) and downloads the latest version."
    )
    .action(async () => {
      await refreshHogDownload()
      await echoTruggleHogVersion()
    })
}
