// * Imports

import { createReducer, createActions } from "reduxsauce";
import Immutable from "seamless-immutable";
import R from "ramda";
import { createSelector } from "reselect";
import { OrgDataSelectors } from "./OrgDataRedux";
import { captureTemplateFixtures } from "../fixtures";
import { getFileTitle } from "../funcs";

// * Types And Action Creators
// selectCaptureTemplateRequest
// deleteCaptureTemplatesOfFile
// renameCaptureTemplate

const { Types, Creators } = createActions({
  deleteCaptureTemplatesOfFile: ["fileId"],
  visitCaptureTemplate: ["item", "navigator"],
  addCaptureTemplateRequest: ["target", "after"],
  addCaptureTemplate: ["name", "target", "content"],
  deleteCaptureTemplate: ["name"],
  showCaptureTemplateActions: ["item", "action"],
  cancelCapture: ["navigator"],
  resetCaptureForm: ["payload"],
  confirm: ["navigator", "target", "payload"],
  updateCaptureForm: ["payload"]
});

export const CaptureTypes = Types;
export default Creators;

// * Initial State

export const emptyCaptureTemplate = {
  name: undefined,
  type: "regular",
  target: {
    fileId: undefined,
    nodeId: undefined,
    headline: undefined
  },
  todo: undefined,
  priority: undefined,
  headline: "",
  tags: [],
  content: "",
  timestamps: []
};

export const INITIAL_STATE = Immutable({
  // selectedCaptureTemplate: null,
  // captureForm: {
  //   ...emptyCaptureTemplate
  // },
  captureTemplates: {}
  // breadcrumbs: [] // selectCaptureTemplate node ancestors
});

// * Selectors

export const CaptureSelectors = {
  captureForm: state => state.capture.captureForm,
  captureTemplates: createSelector(
    [state => state.capture.captureTemplates],
    captureTemplates => {
      return R.values(captureTemplates);
    }
  ),
  captureTemplate: id => state => state.capture.captureTemplates[id],
  captureTemplateExists: name => state =>
    R.has(name, state.capture.captureTemplates)
};

// * Reducers

const deleteCaptureTemplatesOfFile = (state, { fileId }) => {
  return state.merge({
    captureTemplates: R.reject(
      ct => ct.target.fileId === fileId,
      state.captureTemplates
    )
  });
};

export const selectCaptureTemplate = (state, { id, payload }) => {
  return state.merge({
    selectedCaptureTemplate: id,
    // captureForm: state.captureTemplates[id],
    breadcrumbs: payload.breadcrumbs
  });
};

export const addCaptureTemplate = (state, { name, target, content }) => {
  // const targetPath = state.captureForm.nodeId;
  // const target = state.captureForm.target;
  // const cleanCaptureForm = R.pipe(
  //   R.assocPath(
  //     ["target", "headline"],
  //     // getNodePath(target.fileId, target.nodeId)
  //   ),
  //   R.dissocPath(["target", "nodeId"])
  // );
  return state.merge({
    captureTemplates: {
      ...state.captureTemplates,
      [name]: R.merge(emptyCaptureTemplate, {
        name,
        target: {
          fileId: target.fileId,
          headline: target.headline
        },
        ...content
      })
    }
  });
};

const deleteCaptureTemplate = (state, { name }) => {
  return state.merge({
    captureTemplates: state.captureTemplates.without(name)
  });
};

export const resetCaptureForm = (state, { payload }) => {
  return state.merge({
    captureForm: {
      ...emptyCaptureTemplate,
      ...payload
    }
  });
};

export const confirm = (state, { navigator, target, payload }) => {
  return state.merge({});
};

export const updateCaptureForm = (state, { payload }) => {
  return state.merge({ captureForm: { ...state.captureForm, ...payload } });
};

// * Hookup Reducers To Types

export const reducer = createReducer(INITIAL_STATE, {
  [Types.DELETE_CAPTURE_TEMPLATES_OF_FILE]: deleteCaptureTemplatesOfFile,
  // [Types.SELECT_CAPTURE_TEMPLATE]: selectCaptureTemplate,
  [Types.ADD_CAPTURE_TEMPLATE]: addCaptureTemplate,
  [Types.DELETE_CAPTURE_TEMPLATE]: deleteCaptureTemplate,
  [Types.RESET_CAPTURE_FORM]: resetCaptureForm,
  [Types.CONFIRM]: confirm,
  [Types.UPDATE_CAPTURE_FORM]: updateCaptureForm
});
