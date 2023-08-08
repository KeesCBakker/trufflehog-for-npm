import createProgram from "../../src/commands"
import fs from "fs-extra"
import path from "path"
import { Command, CommanderError } from "commander"
import { dir } from "tmp-promise"
import { exec } from "child_process"
import { cwd } from "process"
import dirTree from "directory-tree"
import fsFileTree from "fs-file-tree"
import { displayTree } from "./DirectoryTree"

class TestHelper {
  private static TEMPLATE_DIR = path.join(__dirname, "..", "_template")
  private tempDirectory?: string
  readonly cwd: string

  program: Command
  out: string[] = []
  err: string[] = []
  exitError: CommanderError | null = null
  lastArgs: string[]

  constructor() {
    this.cwd = cwd()
  }

  /**
   * Setup the test environment by copying the template to a temp directory.
   */
  async setup(): Promise<void> {
    if (this.tempDirectory) {
      throw "Helper dirty! Please clean up before setup."
    }

    const { path: tempDir } = await dir()
    this.tempDirectory = tempDir

    await fs.copy(TestHelper.TEMPLATE_DIR, this.tempDirectory)

    process.chdir(this.tempDirectory)

    this.program = createProgram().exitOverride(err => {
      this.exitError = err
      throw err
    })

    this.program.configureOutput({
      writeOut: (str: string) => this.out.push(str),
      writeErr: (str: string) => this.err.push(str)
    })
  }

  /**
   * Get the path to the temporary directory.
   */
  getTempDirectory(): string {
    if (!this.tempDirectory) {
      throw new Error("Temporary directory hasn't been set up yet.")
    }

    return this.tempDirectory
  }

  /**
   * Cleanup the test environment by removing the temp directory.
   */
  async cleanup(): Promise<void> {
    process.chdir(this.cwd)

    if (this.tempDirectory) {
      await fs.remove(this.tempDirectory)
      this.tempDirectory = undefined
    }

    this.lastArgs = []
    this.out = []
    this.err = []
    this.exitError = null
  }

  /**
   * Execute a shell command and return its results.
   * @param command The command to execute.
   */
  async executeCommand(
    command: string
  ): Promise<{ error: Error | null; stdout: string; stderr: string }> {
    return new Promise(resolve => {
      exec(command, (error, stdout, stderr) => {
        resolve({ error, stdout, stderr })
      })
    })
  }

  async run(...args: string[]) {
    try {
      if (args[0] != "node") {
        args = ["node"].concat(args)
      }

      if (args.length > 1 && !["hog", "trufflehog-for-npm"].includes(args[1])) {
        args = ["node", "hog"].concat(args.slice(1))
      }

      this.lastArgs = args
      await this.program.parseAsync(args)
      await this.wait(1)
    } catch {
      return this.exitError?.exitCode || -1
    }

    return 0
  }

  dump() {
    console.log("--EXIT:")
    console.log(this.exitError)

    console.log("--ERROR:")
    console.log(this.err.join())

    console.log("--OUT:")
    console.log(this.out.join())

    console.log("--ARGS:", this.lastArgs)
    console.log()

    console.log("--FILES:")
    displayTree()
    console.log()
  }

  fakeASecret(): string {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    let randomPart = ""

    for (let i = 0; i < 12; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length)
      randomPart += characters[randomIndex]
    }

    return "AK" + "IA" + randomPart + "FAKE"
  }

  /**
   * Write lines to a file in the temp directory.
   * @param relativeFilePath Relative path to the file within the temp directory.
   * @param lines Lines to be written to the file.
   */
  async writeLinesToFile(
    relativeFilePath: string,
    ...lines: string[]
  ): Promise<void> {
    const filePath = path.join(this.getTempDirectory(), relativeFilePath)
    const content = lines.join("\n") + "\n" // Convert lines to a single string and append newline at the end.
    await fs.appendFile(filePath, content) // Append content to the file.
  }

  async wait(ms: number) {
    return new Promise<void>(done => {
      setTimeout(() => done(), ms)
    })
  }
}

export default TestHelper
