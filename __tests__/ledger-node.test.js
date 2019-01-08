const { App, comm_node: comm } = require("../src/utils/ledger");

const TIMEOUT = 1000;
const EXPECTED_MAJOR = 0;
const EXPECTED_MINOR = 1;
const EXPECTED_PATCH = 1;

describe("get_version", function() {
  let response;

  beforeAll(() => {
    return comm.create_async(TIMEOUT, true).then(function(comm) {
      let app = new App(comm);
      return app.get_version().then(function(result) {
        response = result;
        console.log(response);
      });
    });
  });

  it("return_code is 0x9000", function() {
    expect(response.return_code).toBe(0x9000);
  });

  it("has property test_mode", function() {
    expect(response).toHaveProperty("test_mode");
  });

  it("has property major", function() {
    expect(response).toHaveProperty("major");
  });

  it("has property minor", function() {
    expect(response).toHaveProperty("minor");
  });

  it("has property patch", function() {
    expect(response).toHaveProperty("patch");
  });

  it("test_mode is enabled", function() {
    expect(response.test_mode).toBe(true);
  });

  it("app has matching version", function() {
    expect(response.major).toBe(EXPECTED_MAJOR);
    expect(response.minor).toBe(EXPECTED_MINOR);
    expect(response.patch).toBe(EXPECTED_PATCH);
  });
});
