// * CaptureRedux.ts

// ** License

/**
 * Copyright (C) 2018, Bartłomiej Nankiewicz<bartlomiej.nankiewicz@gmail.com>
 *
 * This file is part of Organic.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

// ** Imports

import R from 'ramda';
import { createSelector } from 'reselect';
import Immutable from 'seamless-immutable';
import {
  ActionType,
  createStandardAction as action,
  getType,
  createAsyncAction as asyncAction,
  createAsyncAction,
} from 'typesafe-actions';
import { globalizeParametrizedSelectors, globalizeSelectors } from './Helpers';
import { CaptureInitialState as IS, CaptureTemplate } from './types';

// ** Action Creators

const Creators = {
  addCaptureTemplate: asyncAction(
    'ADD_CAPTURE_TEMPLATE_REQUEST',
    'ADD_CAPTURE_TEMPLATE_SUCCESS',
    'ADD_CAPTURE_TEMPLATE_ERROR',
  )<
    { target: string; after: string },
    {
      name: string;
      target: string;
      content: string;
    },
    Error
  >(),
  cancelCapture: action('CANCEL_CAPTURE')<{ navigator: string }>(),
  confirm: action('CONFIRM')<{
    navigator: object;
    target: string;
    payload: string;
  }>(),
  deleteCaptureTemplate: action('DELETE_CAPTURE_TEMPLATE')<{ name: string }>(),
  deleteCaptureTemplatesOfFile: action('DELETE_CAPTURE_TEMPLATES_OF_FILE')<{
    fileId: string;
  }>(),
  resetCaptureForm: action('RESET_CAPTURE_FORM')<{ payload: string }>(),
  showCaptureTemplateActions: action('SHOW_CAPTURE_TEMPLATE_ACTIONS')<{
    item: string;
    action: string;
  }>(),
  updateCaptureForm: action('UPDATE_CAPTURE_FORM')<{ payload: string }>(),
  visitCaptureTemplate: action('VISIT_CAPTURE_TEMPLATE')<{
    item: string;
    navigator: object;
  }>(),
};

export type CaptureAction = ActionType<typeof Creators>;

// ** Empty capture template

export const emptyCaptureTemplate: CaptureTemplate = {
  name: undefined,
  type: 'regular',
  target: {
    fileId: undefined,
    nodeId: undefined,
    headline: undefined,
  },
  todo: undefined,
  priority: undefined,
  headline: '',
  tags: [],
  content: '',
  timestamps: [],
};

// ** Initial State

export const INITIAL_STATE: IS = Immutable({
  captureTemplates: {},
});

// ** Selectors

const selectors = {
  captureTemplates: createSelector(
    [(state: IS) => state.captureTemplates],
    (captureTemplates) => R.values(captureTemplates),
  ),
};

const parametrizedSelctors = {
  captureTemplate: (id: string) => (state: IS) => state.captureTemplates[id],
  captureTemplateExists: (name: string) => (state: IS) =>
    R.has(name, state.captureTemplates),
};

const CaptureSelectors = {
  ...globalizeSelectors('capture')(selectors),
  ...globalizeParametrizedSelectors('capture')(parametrizedSelctors),
};

// ** Reducers

const reducer = (state = INITIAL_STATE, action: CaptureAction) => {
  switch (action.type) {
    case getType(Creators.addCaptureTemplate.success): {
      const { name, target, content } = action.payload;
      return state.merge({
        captureTemplates: {
          ...state.captureTemplates,
          [name]: R.merge(emptyCaptureTemplate, {
            name,
            target: {
              fileId: target.fileId,
              headline: target.headline,
            },
            ...content,
          }),
        },
      });
    }
    case getType(Creators.deleteCaptureTemplate): {
      const { name } = action.payload;
      return state.merge({
        captureTemplates: state.captureTemplates.without(name),
      });
    }

    case getType(Creators.deleteCaptureTemplatesOfFile): {
      const { fileId } = action.payload;
      return state.merge({
        captureTemplates: R.reject(
          (ct) => ct.target.fileId === fileId,
          state.captureTemplates,
        ),
      });
    }
    // TODO not sure if this action is used
    case getType(Creators.updateCaptureForm): {
      const { payload } = action.payload;
      return state.merge({ captureForm: { ...state.captureForm, ...payload } });
    }

    default:
      return state;
  }
};

// * Exports

export { reducer, CaptureSelectors };
export default Creators;
