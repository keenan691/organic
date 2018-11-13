import { OrgDataSelectors } from "../../../src/redux/OrgDataRedux";
import { INITIAL_STATE } from "../../../src/redux/OrgDataRedux";

const globalState = { data: INITIAL_STATE }

describe("OrgDataRedux", () => {
  it("should match a snapshot", () => {
    expect(OrgDataSelectors.getCurrentNavigationStack(globalState)).toMatchSnapshot()
    expect(OrgDataSelectors.getDayTimestamps(globalState)).toMatchSnapshot()
    expect(OrgDataSelectors.getFile('1')(globalState)).toMatchSnapshot()
    expect(OrgDataSelectors.getFileNodes('fileId')(globalState)).toMatchSnapshot()
    expect(OrgDataSelectors.getFiles(globalState)).toMatchSnapshot()
    expect(OrgDataSelectors.getFilesIds(globalState)).toMatchSnapshot()
    expect(OrgDataSelectors.getLastCapturedNotes(globalState)).toMatchSnapshot()
    expect(OrgDataSelectors.getLoadedNodesIds(globalState)).toMatchSnapshot()
    expect(OrgDataSelectors.getMarkedPlaces(globalState)).toMatchSnapshot()
    expect(OrgDataSelectors.getMode(globalState)).toMatchSnapshot()
    expect(OrgDataSelectors.getNode('nodeId')(globalState)).toMatchSnapshot()
    expect(OrgDataSelectors.getNodes(globalState)).toMatchSnapshot()
    expect(OrgDataSelectors.getTags(globalState)).toMatchSnapshot()
    expect(OrgDataSelectors.getTimestamps(globalState)).toMatchSnapshot()
    expect(OrgDataSelectors.getTimestampsRange(globalState)).toMatchSnapshot()
    expect(OrgDataSelectors.getVisitedNodeId(globalState)).toMatchSnapshot()
    expect(OrgDataSelectors.isDataLoaded(globalState)).toMatchSnapshot()
    expect(OrgDataSelectors.isVisitedPlaceSink(globalState)).toMatchSnapshot()
    expect(OrgDataSelectors.navigationStackHistory(globalState)).toMatchSnapshot()
  });
});
