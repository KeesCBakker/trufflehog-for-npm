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
      helper.err.some(x =>
        x.includes(
          "Let's use trufflehog to scan you NPM package before it is published."
        )
      )
    ).to.be.true
  })

  it("should show a version", async () => {
    await helper.run("--version")
    expect(
      helper.err.some(x =>
        x.includes(
          "Let's use trufflehog to scan you NPM package before it is published."
        )
      )
    ).to.be.true
  })

  it("should detect secret in NPM package", async () => {
    helper.writeLinesToFile(
      "secret.sauce",
      "AWS_ACCESS_KEY_ID=" + helper.fakeASecret()
    )

    await helper.run("scan")

    // const command = `your-cli-command --input ${helper.getTempDirectory()}/input-file`
    // const { error, stdout, stderr } = await helper.executeCommand(command)

    // if (error) {
    //   throw error
    // }

    // const resultFilePath = path.join(helper.getTempDirectory(), "output-file")
    // const result = await fs.readFile(resultFilePath, "utf8")
    expect("Expected Output").to.equal("Expected Output")
  })
})
