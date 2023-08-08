import TestHelper from "../common/TestHelper"
import { expect } from "chai"
import { inferTestName } from "../common/naming"
import { executeNpm } from "../../src/shell/npm"

describe(inferTestName(), function () {
  const helper = new TestHelper()
  let exitCode: number

  before(async () => {
    // create package based on template
    await helper.setup()

    // install our CLI
    await helper.run("install", "npm")

    // write some bad code
    helper.writeLinesToFile(
      "src/rockstar.js",
      `let token = "${helper.fakeASecret()}"; console.log(token);`
    )

    // trigger publish
    await helper.npm("publish")
  })

  after(() => helper.cleanup())

  it("should not finish correctly", () => {
    expect(exitCode).to.eql(1)
  })

  it.only("should detect a secret", () => {
    expect(helper.err).to.include('"unverified_secrets": 1')
  })
})
