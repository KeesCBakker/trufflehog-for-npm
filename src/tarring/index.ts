import * as path from "path"
import * as tar from "tar"
import * as tmp from "tmp-promise"
import fs from "fs-extra"

export type DirectoryInspector = (
  directoryPath: string,
  tarball: string
) => Promise<void>

export type UnTarResult = {
  file: string
  directory: string
  cleanUp: () => Promise<void>
}

export async function unpack(
  tarball: string,
  destination: string,
  keep: boolean
) {
  let cleanup: () => Promise<void>

  if (destination) {
    destination = path.resolve(destination)
    await fs.ensureDir(destination)
    cleanup = async () => {
      if (!keep) {
        await fs.remove(destination)
      }
    }
  } else {
    const tmpDir = await tmp.dir({
      unsafeCleanup: !keep,
      keep: keep
    })

    destination = tmpDir.path
    cleanup = async () => {
      if (!keep) {
        await tmpDir.cleanup()
      }
    }
  }

  // Extract the tarball to the temporary directory
  await tar.extract({ file: tarball, cwd: destination })

  return {
    file: tarball,
    directory: path.join(destination, "package"),
    cleanUp: cleanup
  }
}
