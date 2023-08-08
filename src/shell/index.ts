import { spawn } from "child_process"

export async function executeShell(
  program: string,
  args: string[],
  silent: boolean = true
): Promise<{ stdout: string; stderr: string }> {
  let stdout = ""
  let stderr = ""

  const options = { shell: true }

  const childProcess = spawn(program, args, options)

  childProcess.stdout.on("data", data => {
    stdout += data
    if (!silent) {
      process.stdout.write(data)
    }
  })

  childProcess.stderr.on("data", data => {
    stderr += data
    if (!silent) {
      process.stderr.write(data)
    }
  })

  return new Promise<{ stdout: string; stderr: string }>((resolve, reject) => {
    childProcess.on("close", code => {
      if (code !== 0) {
        reject(new Error(`${program} failed with error code: ${code}`))
      } else {
        resolve({ stdout, stderr })
      }
    })
  })
}
