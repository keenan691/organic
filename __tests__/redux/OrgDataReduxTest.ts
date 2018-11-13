import sagas from "../../src/redux/OrgDataRedux";

describe("OrgDataRedux", () => {
  it("should match a snapshot", () => {
    const methods = Object.getOwnPropertyNames(sagas)
    expect(methods).toMatchSnapshot()
  });
});
