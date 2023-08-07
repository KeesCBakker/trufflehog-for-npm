import * as path from "path"
import * as tar from "tar"
import * as tmp from "tmp-promise"

export type DirectoryInspector = (
  directoryPath: string,
  tarball: string
) => Promise<void>

export type UnTarResult = {
  file: string
  directory: string
  cleanUp: () => Promise<void>
}

export async function unpack(tarball: string) {
  // Create a temporary directory
  const tmpDir = await tmp.dir({ unsafeCleanup: true })

  // Extract the tarball to the temporary directory
  await tar.extract({ file: tarball, cwd: tmpDir.path })

  return {
    file: tarball,
    directory: path.join(tmpDir.path, "package"),
    cleanUp: () => tmpDir.cleanup()
  }
}
