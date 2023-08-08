import { Command } from "commander"
import { getPackageDetails } from "../meta"
import { addTrufflehogCommand } from "./hog"
import { addInstallCommand } from "./install"
import { addPreCommitCommand } from "./pre-comit"
import { addRefreshCommand } from "./refresh"
import { addScanCommand } from "./scan"

function createProgram() {
  const details = getPackageDetails()
  const program = new Command()

  program
    .name(details.name)
    .alias("hog")
    .alias("npm-hog")
    .version(details.version)
    .description(details.description)

  addTrufflehogCommand(program)
  addScanCommand(program)
  addRefreshCommand(program)
  addPreCommitCommand(program)
  addInstallCommand(program)

  return program
}

export default createProgram
