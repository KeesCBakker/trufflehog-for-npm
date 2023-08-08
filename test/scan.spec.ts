import { basename } from "path"
import TestHelper from "./common/TestHelper"
import { expect } from "chai"

describe(basename(__filename), function () {
  const helper = new TestHelper()

  beforeEach(() => helper.setup())

  afterEach(() => helper.cleanup())

  it("should return non 0 exit code when secret is found in package", async () => {
    helper.writeLinesToFile("secret.sauce", "BOT_TOKEN=" + helper.fakeASecret())
    let exitCode = await helper.run("scan", "-d", "./unpacked", "-s")
    expect(exitCode).not.to.eql(0)
  })

  it("should return 0 exit code when no secret is found in package", async () => {
    let exitCode = await helper.run("scan", "-d", "./unpacked", "-s")
    expect(exitCode).to.eql(0)
  })
})
