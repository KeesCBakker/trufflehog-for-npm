import TestHelper from "./common/TestHelper"
import { expect } from "chai"
import { inferTestName } from "./common/naming"

describe(inferTestName(), function () {
  const helper = new TestHelper()
  let exitCode = -77
  let packageJson: any

  before(async () => {
    await helper.setup()
    exitCode = await helper.run("install", "npm")
    packageJson = await helper.getJson("package.json")
  })

  after(() => helper.cleanup())

  it("should have installed correctly", () => {
    expect(exitCode).to.eql(0)
  })

  it("should have trufflehog-for-npm dev dependency", async () => {
    expect(packageJson).not.to.be.empty
    expect(packageJson.devDependencies).not.to.be.empty
    expect(packageJson.devDependencies).to.contain.keys("trufflehog-for-npm")
  })

  it("should have the npm-scan script", async () => {
    expect(packageJson).not.to.be.empty
    expect(packageJson.scripts).not.to.be.empty
    expect(packageJson.scripts).to.contain.keys("npm-scan")
    expect(packageJson.scripts["npm-scan"]).to.eql("trufflehog-for-npm scan")
  })

  it("should have the prepublishOnly script", async () => {
    expect(packageJson).not.to.be.empty
    expect(packageJson.scripts).not.to.be.empty
    expect(packageJson.scripts).to.contain.keys("prepublishOnly")
    expect(packageJson.scripts["prepublishOnly"]).to.eql("npm run npm-scan")
  })
})
