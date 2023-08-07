#!/usr/bin/env node

import { Command } from "commander"
import { getPackageDetails } from "./meta"
import { addTrufflehogCommand } from "./commands/hog"
import { addScanCommand } from "./commands/scan"
import { addRefreshCommand } from "./commands/refresh"
import { addPreCommitCommand } from "./commands/pre-comit"

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

program.parse()
