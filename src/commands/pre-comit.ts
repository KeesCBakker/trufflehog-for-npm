import { Command } from "commander"
import { start } from "../trufflehog/runner"
import { signalNoSecretsFound, signalSecretsFoundBanner } from "../console"

export function addPreCommitCommand(program: Command) {
  program
    .command("pre-commit")
    .alias("precommit")
    .description(
      "Scans the staged files with trufflehog. Can be used in a pre-commit hook."
    )
    .action(async () => {
      try {
        await start(["git", "file://.", "--since-commit", "HEAD", "--fail"])
        signalNoSecretsFound()
      } catch {
        signalSecretsFoundBanner()
        process.exit(138)
      }
    })
}
