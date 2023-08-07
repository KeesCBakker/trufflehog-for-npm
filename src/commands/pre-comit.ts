import { Command } from "commander"
import {
  executeTrufflehog,
  scanPreCommitWithTrufflehog
} from "../trufflehog/runner"
import { signalNoSecretsFound, signalSecretsFoundBanner } from "../console"

export function addPreCommitCommand(program: Command) {
  program
    .command("pre-commit")
    .description(
      "Scans the staged files with trufflehog. Can be used in a pre-commit hook."
    )
    .action(async () => {
      try {
        await scanPreCommitWithTrufflehog()
        signalNoSecretsFound()
      } catch {
        signalSecretsFoundBanner()
        process.exit(138)
      }
    })
}
