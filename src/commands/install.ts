import { Command } from "commander"
import { executeNpm, executeNpmInstallMe } from "../shell/npm"
import { out, title } from "../console"

export function addInstallCommand(program: Command) {
  const installCommand = program
    .command("install")
    .description(
      "Installs trufflehog as pre-commit (GIT) and pre-publish (NPM) hooks."
    )

  installCommand
    .command("npm")
    .description(
      "Install trufflehog into your NPM package as a pre-publish hook."
    )
    .action(async () => {
      title("Installing trufflehog-for-npm")

      await executeNpmInstallMe()

      title("Pre publish scripts")

      out("Wriscripts.npm-scan=trufflehog-for-npm scan")

      await executeNpm([
        "pkg",
        "set",
        '"scripts.npm-scan=trufflehog-for-npm scan"'
      ])

      out("scripts.prepublishOnly=npm run npm-scan")

      await executeNpm([
        "pkg",
        "set",
        '"scripts.prepublishOnly=npm run npm-scan"'
      ])

      title("Finished")
    })

  installCommand
    .command("pre-commit")
    .description("Install a trufflehog scan as a pre-commit hook.")
}
