import { basename } from "path"
import TestHelper from "./common/TestHelper"
import { expect } from "chai"

describe(basename(__filename), function () {
  const helper = new TestHelper()

  beforeEach(() => helper.setup())

  afterEach(() => helper.cleanup())

  it("should show a help", async () => {
    await helper.run("--help")
    expect(
      helper.out.some(x =>
        x.includes(
          "Let's use trufflehog to scan you NPM package before it is published."
        )
      )
    ).to.be.true
  })

  it("should show a version", async () => {
    await helper.run("--version")
    expect(helper.out.join().trim()).to.match(/^\d\.\d\.\d$/)
  })
})
