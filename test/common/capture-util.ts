export function captureOutput(): {
  start: () => void
  stop: () => { stdout: string; stderr: string }
} {
  const originalStdoutWrite = process.stdout.write.bind(process.stdout)
  const originalStderrWrite = process.stderr.write.bind(process.stderr)
  const capturedStdout: string[] = []
  const capturedStderr: string[] = []

  return {
    start: () => {
      process.stdout.write = (chunk: any, encoding?: any, callback?: any) => {
        capturedStdout.push(chunk.toString())
        return true
      }
      process.stderr.write = (chunk: any, encoding?: any, callback?: any) => {
        capturedStderr.push(chunk.toString())
        return true
      }
    },
    stop: () => {
      process.stdout.write = originalStdoutWrite
      process.stderr.write = originalStderrWrite
      return { stdout: capturedStdout.join(), stderr: capturedStderr.join() }
    }
  }
}
