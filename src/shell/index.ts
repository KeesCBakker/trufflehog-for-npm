import { spawn } from "child_process"

export async function executeShell(
  program: string,
  args: string[],
  silent: boolean
) {
  let options: Record<string, any> = { shell: true }
  if (!silent) {
    options.stdio = "inherit"
  }

  return new Promise<void>((resolve, reject) => {
    const trufflehog = spawn(program, args, options)

    trufflehog.on("close", code => {
      if (code !== 0) {
        reject(new Error(program + " failed with error code: " + code))
      } else {
        resolve()
      }
    })
  })
}
