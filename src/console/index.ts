import chalk from "chalk"

export function title(str: string) {
  console.log("")
  console.log(chalk.gray("-".repeat(str.length)))
  console.log(chalk.yellow(str.toUpperCase()))
  console.log(chalk.gray("-".repeat(str.length)))
  console.log("")
}

export function signalSecretsFoundBanner() {
  console.log("")
  console.log(chalk.bgRed("                        "))
  console.log(chalk.bgRed("     Secrets found!     "))
  console.log(chalk.bgRed("                        "))
  console.log("")
  console.log("")
}

export function signalNoSecretsFound() {
  console.log(chalk.green("No secrets found."))
}
