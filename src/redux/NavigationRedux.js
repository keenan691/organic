import { createReducer, createActions } from "reduxsauce";
import Immutable from "seamless-immutable";
import R from "ramda";

// screenWillAppear
// setCaptureRoute
// setModalState
// loadBreadcrumbs
// updateNavigation
// setCaptureType
// setupCapture

// * Types and Action Creators

const { Types, Creators } = createActions({
  setupCapture: ["payload"],
  updateNavigation: ["payload"],
  loadBreadcrumbs: ["target"],
  setModalState: ["visiblity"],
  setCaptureRoute: ["route"],
  screenWillAppear: ["id"],
  // selectCaptureTemplate: null,
  selectCaptureTemplateRequest: ["id"]
  // navigationStackChanged: ["to"]
});

export const NavigationTypes = Types;
export default Creators;


// * Initial State

const CAPTURE_ROUTES = [
  {
    key: "templates",
    label: "Targets",
    icon: "ios-briefcase-outline"
  },
  {
    key: "headline",
    label: "Headline",
    icon: "ios-aperture-outline"
  },
  {
    key: "content",
    label: "Content",
    icon: "ios-briefcase-outline"
  }
];

export const INITIAL_STATE = Immutable({
  navigationStackHistory: [],
  visibleScreenId: null,
  isModalVisible: false,
  captureType: "capture",
  selectedCaptureTemplate: null,
  breadcrumbs: [], // selectCaptureTemplate node ancestors
  captureNavigationState: {
    index: 0,
    routes: [CAPTURE_ROUTES[0], CAPTURE_ROUTES[1], CAPTURE_ROUTES[2]]
  }
});

// * Selectors

const navigationStackHistory = state => state.navigation.navigationStackHistory;
const getCaptureRoute = state => state.navigation.captureNavigationState;
const isModalVisible = state => state.navigation.isModalVisible;

export const NavigationSelectors = {
  navigationStackHistory,
  breadcrumbs: state => state.navigation.breadcrumbs,
  getVisibleScreenId: state => state.navigation.visibleScreenId,
  getCaptureRoute,
  isModalVisible,
  // getSelectedCaptureTemplate: state => state.navigation.selectedCaptureTemplate
  getSelectedCaptureTemplate: R.pathOr(null, [
    "form",
    "capture",
    "values",
    "name"
  ]),
  getCaptureType: R.path(["navigation", "captureType"])
};

// * Reducers

export const setupCapture = (state, { payload }) => {
  return state.merge(payload);
};

export const updateNavigation = (state, { payload }) => {
  return state.merge({
    ...payload
  });
};

export const setModalState = (state, { visiblity }) => {
  return state.merge({
    isModalVisible: visiblity
  });
};

const screenWillAppear = (state, { id }) =>
  state.merge({
    visibleScreenId: id
  });

const setCaptureRoute = (state, { route }) =>
  state.setIn(["captureNavigationState", "index"], route);

export const navigationStackChanged = (state, { to }) => {
  if (state.navigationStackHistory[0] === to) return state;

  return state.merge({
    navigationStackHistory: R.pipe(
      R.prepend(to),
      R.when(R.pipe(R.length, R.gt(R.__, 2)), R.dropLast(1))
    )(state.navigationStackHistory)
  });
};

// Goes to edit tab after template selection
export const selectCaptureTemplate = state => {
  return (
    state
      // .merge({
      //   selectedCaptureTemplate: id,
      //   // captureForm: state.captureTemplates[id],
      //   breadcrumbs: payload.breadcrumbs
      // })
      .setIn(["captureNavigationState", "index"], 1)
  );
};

// * Hookup Reducers To Types

export const reducer = createReducer(INITIAL_STATE, {
  [Types.SETUP_CAPTURE]: setupCapture,
  [Types.UPDATE_NAVIGATION]: updateNavigation,
  [Types.SET_MODAL_STATE]: setModalState,
  [Types.SET_CAPTURE_ROUTE]: setCaptureRoute,
  [Types.SELECT_CAPTURE_TEMPLATE_REQUEST]: selectCaptureTemplate,
  [Types.SCREEN_WILL_APPEAR]: screenWillAppear
  // [Types.NAVIGATION_STACK_CHANGED]: navigationStackChanged
});
