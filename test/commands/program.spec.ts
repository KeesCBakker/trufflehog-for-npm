import TestHelper from "../common/TestHelper"
import { expect } from "chai"
import { inferTestName } from "../common/naming"

describe(inferTestName(), function () {
  const helper = new TestHelper()

  beforeEach(() => helper.setup())

  afterEach(() => helper.cleanup())

  it("should show a help", async () => {
    await helper.run("--help")
    expect(helper.out).to.include(
      "Let's use trufflehog to scan you NPM package before it is published."
    )
  })

  it("should show a version", async () => {
    await helper.run("--version")
    expect(helper.out.trim()).to.match(/^\d\.\d\.\d$/)
  })
})
