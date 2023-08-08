import chalk from "chalk"

export function title(str: string, silent = false) {
  if (silent) return
  out("")
  out(chalk.gray("-".repeat(str.length)))
  out(chalk.yellow(str.toUpperCase()))
  out(chalk.gray("-".repeat(str.length)))
  out("")
}

export function signalSecretsFoundBanner(silent = false) {
  if (silent) return
  out("")
  out(chalk.bgRed("                        "))
  out(chalk.bgRed("     Secrets found!     "))
  out(chalk.bgRed("                        "))
  out("")
  out("")
}

export function signalNoSecretsFound(silent = false) {
  if (silent) return
  out(chalk.green("No secrets found."))
}

export function out(...line: string[]) {
  process.stdout.write(line.join(" "))
  process.stderr.write("\n")
}
