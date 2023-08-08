import { Command } from "commander"

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

  installCommand
    .command("pre-commit")
    .description("Install a trufflehog scan as a pre-commit hook.")
}
