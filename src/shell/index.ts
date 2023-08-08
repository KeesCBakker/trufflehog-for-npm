import { spawn } from "child_process"

export async function executeShell(
  program: string,
  args: string[]
): Promise<number> {
  const options = {
    shell: true,
    stdio: "inherit"
  }

  // when we're testing, don't share the stdio
  const isTest = process.argv.some(arg => arg.includes("mocha"))
  if (isTest) {
    delete options.stdio
  }

  const childProcess = spawn(program, args)

  // when we're testing, pip the data by hand
  if (isTest) {
    childProcess.stdout.on("data", data => {
      process.stdout.write(data)
      process.stdout.write("\n")
    })

    childProcess.stderr.on("data", data => {
      process.stderr.write(data)
      process.stderr.write("\n")
    })
  }

  return new Promise((resolve, reject) => {
    childProcess.on("close", code => {
      if (code !== 0) {
        reject(new Error(`${program} failed with error code: ${code}`))
      } else {
        resolve(code)
      }
    })
  })
}
