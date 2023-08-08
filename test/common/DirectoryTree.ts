import fs from "fs"
import path from "path"

export class DirectoryTree {
  root: string

  constructor(root: string) {
    this.root = root
  }

  displayTree(dir: string = this.root, prefix: string = ""): void {
    const entries = fs.readdirSync(dir)
    const totalEntries = entries.length

    entries.forEach((entry, index) => {
      const isLast = index === totalEntries - 1
      console.log(`${prefix}${isLast ? "└── " : "├── "}${entry}`)

      const fullPath = path.join(dir, entry)
      if (fs.statSync(fullPath).isDirectory()) {
        const newPrefix = prefix + (isLast ? "    " : "│   ")
        this.displayTree(fullPath, newPrefix)
      }
    })
  }
}

export function displayTree(dir = ".") {
  const d = new DirectoryTree(dir)
  d.displayTree()
}
