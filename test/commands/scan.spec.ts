import TestHelper from "../common/TestHelper"
import { expect } from "chai"
import { inferTestName } from "../common/naming"

describe(inferTestName(), function () {
  const helper = new TestHelper()

  beforeEach(() => helper.setup())

  afterEach(() => helper.cleanup())

  async function scanPackage() {
    // use an unpack directory local to the packag
    // don't verify for speed
    let exitCode = await helper.run(
      "scan",
      "--unpack-directory",
      "./unpacked",
      "--no-verification",
      "-k"
    )

    // you can dump the helper for debugging
    //helper.dump();

    return exitCode
  }

  it("should return non 0 exit code when secret is found in package", async () => {
    helper.writeLinesToFile("secret.sauce", "BOT_TOKEN=" + helper.fakeASecret())
    let exitCode = await scanPackage()
    expect(helper.out).to.include("Secrets found")
    expect(exitCode).not.to.eql(0)
  })

  it("should return non 0 exit code when secret in code is found in package", async () => {
    helper.writeLinesToFile(
      "src/rockstar.js",
      `let token = "${helper.fakeASecret()}"; console.log(token);`
    )
    let exitCode = await scanPackage()
    expect(helper.out).to.include("Secrets found")
    expect(exitCode).not.to.eql(0)
  })

  it("should return 0 exit code when no secret is found in package", async () => {
    let exitCode = await scanPackage()
    expect(helper.out).to.include("No secrets found")
    expect(exitCode).to.eql(0)
  })
})
