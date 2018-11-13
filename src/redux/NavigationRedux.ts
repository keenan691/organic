// * NavigationRedux.ts

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
import Immutable from 'seamless-immutable';
import {
  ActionType,
  createStandardAction as action,
  getType,
} from 'typesafe-actions';
import { globalizeSelectors } from './Helpers';
import { CaptureRoute, NavigationInitialState as IS } from './types';

// ** Action Creators

const Creators = {
  loadBreadcrumbs: action('LOAD_BREADCRUMBS')<{ target: string }>(),
  selectCaptureTemplateRequest: action('SELECT_CAPTURE_TEMPLATE_REQUEST')<{
    id: string;
  }>(),
  setCaptureRoute: action('SET_CAPTURE_ROUTE')<{ route: number }>(),
  setModalState: action('SET_MODAL_STATE')<{ visiblity: boolean }>(),
  setupCapture: action('SETUP_CAPTURE')<{ captureType: string }>(),
  screenWillAppear: action('SCREEN_WILL_APPEAR')<{ id: string }>(),
  // TODO change name to update breadcrumbs
  updateNavigation: action('UPDATE_NAVIGATION')<{
    breadcrumbs: { fileId: string; headline: string }[];
  }>(),
};

export type NavigationAction = ActionType<typeof Creators>;

// ** Initial State

const CAPTURE_ROUTES: CaptureRoute[] = [
  {
    key: 'templates',
    label: 'Targets',
    icon: 'ios-briefcase-outline',
  },
  {
    key: 'headline',
    label: 'Headline',
    icon: 'ios-aperture-outline',
  },
  {
    key: 'content',
    label: 'Content',
    icon: 'ios-briefcase-outline',
  },
];

export const INITIAL_STATE: IS = Immutable({
  breadcrumbs: [],
  captureNavigationState: {
    index: 0,
    routes: [CAPTURE_ROUTES[0], CAPTURE_ROUTES[1], CAPTURE_ROUTES[2]],
  },
  captureType: 'capture',
  isModalVisible: false,
  navigationStackHistory: [],
  selectedCaptureTemplate: null,
  visibleScreenId: null,
});

// ** Selectors

// ** Local selectors

const selectors = {
  breadcrumbs: (state: IS) => state.breadcrumbs,
  getCaptureRoute: (state: IS) => state.captureNavigationState,
  getCaptureType: (state: IS) => state.captureType,
  getVisibleScreenId: (state: IS) => state.visibleScreenId,
  isModalVisible: (state: IS) => state.isModalVisible,
  navigationStackHistory: (state: IS) => state.navigationStackHistory,
};

const globalizedSelectors = globalizeSelectors('navigation')(selectors);

// ** Global selectors

const getSelectedCaptureTemplate = R.pathOr(null, [
  'form',
  'capture',
  'values',
  'name',
]);

// ** Bundle selectors

const NavigationSelectors = {
  ...globalizedSelectors,
  getSelectedCaptureTemplate,
};

// ** Reducer

const reducer = (state = INITIAL_STATE, action: NavigationAction) => {
  switch (action.type) {
    case getType(Creators.setupCapture): {
      const { captureType } = action.payload;
      return state.merge({ captureType });
    }

    case getType(Creators.updateNavigation): {
      const { breadcrumbs } = action.payload;
      return state.merge({
        breadcrumbs,
      });
    }

    case getType(Creators.setModalState): {
      const { visiblity } = action.payload;
      return state.merge({
        isModalVisible: visiblity,
      });
    }

    case getType(Creators.setCaptureRoute): {
      const { route } = action.payload;
      return state.setIn(['captureNavigationState', 'index'], route);
    }

    case getType(Creators.selectCaptureTemplateRequest): {
      return state.setIn(['captureNavigationState', 'index'], 1);
    }

    case getType(Creators.screenWillAppear): {
      const { id } = action.payload;
      return state.merge({
        visibleScreenId: id,
      });
    }

    default:
      return state;
  }
};

// * Exports

export { reducer, NavigationSelectors };
export default Creators;
