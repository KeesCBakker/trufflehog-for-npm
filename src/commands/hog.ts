import { Command } from "commander"
import { start } from "../trufflehog/runner"

export function addTrufflehogCommand(program: Command) {
  program
    .command("trufflehog")
    .allowUnknownOption()
    .option("--help")
    .description(
      "Starts trufflehog with the specified parameters. If trufflehog is not in your path, it will be downloaded."
    )
    .action(async (_, options) => {
      await start(options.args.map(x => (x == "version" ? "--version" : x)))
    })
}