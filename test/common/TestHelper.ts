import createProgram from "../../src/commands"
import fs from "fs-extra"
import path, { dirname } from "path"
import { Command, CommanderError } from "commander"
import { dir } from "tmp-promise"
import { cwd } from "process"
import { displayTree } from "./DirectoryTree"
import { captureOutput } from "./capture-util"
import { executeShell } from "../../src/shell"
import { executeNpm } from "../../src/shell/npm"

class TestHelper {
  private static TEMPLATE_DIR = path.join(__dirname, "..", "_template")
  private tempDirectory?: string
  readonly cwd: string

  program: Command
  out: string = ""
  err: string = ""
  exitError: CommanderError | null = null
  lastError: Error | null = null
  lastArgs: string[]
  lastExitCode: number | null = null
  originalExit: { (code?: number): never; (code?: number): never }

  constructor() {
    this.cwd = cwd()
    this.originalExit = process.exit
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
    this.out = ""
    this.err = ""
    this.exitError = null
  }

  async npm(...args: string[]) {
    this.lastArgs = ["npm"].concat(args)
    return this.execute(() => executeNpm(args))
  }

  async shell(program: string, ...args: string[]) {
    this.lastArgs = [program].concat(args)
    return this.execute(() => executeShell(program, args))
  }

  async run(...args: string[]) {
    if (args[0] != "node") {
      args = ["node"].concat(args)
    }

    if (args.length > 1 && !["hog", "trufflehog-for-npm"].includes(args[1])) {
      args = ["node", "hog"].concat(args.slice(1))
    }

    this.lastArgs = args
    return this.execute(() => this.program.parseAsync(args))
  }

  dump(dir: string = "."): void {
    console.log("--EXIT:")
    console.log(this.exitError)

    console.log("--EXECUTE-ERROR:")
    console.log(this.lastError)

    console.log("--ERROR:")
    console.log(this.err)

    console.log("--OUT:")
    console.log(this.out)

    console.log("--ARGS:", this.lastArgs)
    console.log()

    if (dir != null) {
      console.log("--FILES:")
      displayTree(dir)
      console.log()
    }
  }

  fakeASecret(): string {
    const randomNumbers = (): string => {
      let result = ""
      for (let i = 0; i < 11; i++) {
        result += Math.floor(Math.random() * 10).toString()
      }
      return result
    }

    const randomChars = (): string => {
      const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
      let result = ""
      for (let i = 0; i < 24; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length)
        result += characters[randomIndex]
      }
      return result
    }

    return `xoxb-${randomNumbers()}-${randomNumbers()}-${randomChars()}`
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
    const dir = dirname(filePath)
    await fs.ensureDir(dir)

    const content = lines.join("\n") + "\n" // Convert lines to a single string and append newline at the end.
    await fs.appendFile(filePath, content) // Append content to the file.
  }

  async getFileContents(relativeFilePath) {
    const filePath = path.join(this.getTempDirectory(), relativeFilePath)
    let file = await fs.readFile(filePath)
    return file
  }

  async getJson(relativeFilePath: string) {
    let contents = await this.getFileContents(relativeFilePath)
    return JSON.parse(contents.toString())
  }

  async cat(relativeFilePath: string) {
    let contents = await this.getFileContents(relativeFilePath)
    console.log(contents.toString())
  }

  async wait(ms: number) {
    return new Promise<void>(done => {
      setTimeout(() => done(), ms)
    })
  }

  private async execute<T>(item: () => Promise<T>) {
    process.exit = function (code) {
      throw new Error(`Process exited with code: ${code}`)
    }

    var capture = captureOutput()
    capture.start()

    try {
      await item()
    } catch (ex) {
      this.lastError = ex
      return this.exitError?.exitCode || 1
    } finally {
      const { stderr, stdout } = capture.stop()
      this.err = this.err.concat(stderr)
      this.out = this.out.concat(stdout)
      process.exit = this.originalExit
    }

    return 0
  }
}

export default TestHelper
