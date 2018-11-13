// * HeadlinePreview.tsx

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

import React from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { getFormValues } from 'redux-form';
import { createSelector } from 'reselect';
import { AgendaDisplayLong } from '../components/AgendaDisplayLong';
import Breadcrumbs from '../components/Breadcrumbs';
import { Headline } from '../components/Headline';
import { NavigationSelectors } from '../redux/NavigationRedux';
import R from 'ramda';

// ** Shape
// ** Helpers

const getBreadcrumbsNodes = createSelector(
  [R.prop('captureType'), R.prop('breadcrumbs')],
  (cType, breadcrumbs) => {
    if (cType === 'edit') {
      breadcrumbsNodes = R.pipe(R.drop(1), R.dropLast(1))(breadcrumbs);
    } else {
      breadcrumbsNodes = R.drop(1, breadcrumbs);
    }
    return breadcrumbsNodes;
  },
);

// ** Main

export const HeadlinePreview = connect((state) => ({
  captureForm: getFormValues('capture')(state),
  breadcrumbs: NavigationSelectors.breadcrumbs(state),
  captureType: NavigationSelectors.getCaptureType(state),
}))((props) => {
  let editedNodeLevel;
  if (props.captureType === 'edit') {
    editedNodeLevel = props.breadcrumbs.length - 1;
  } else {
    editedNodeLevel = props.breadcrumbs.length;
  }
  const breadcrumbsNodes = getBreadcrumbsNodes(props);
  return (
    <View>
      {props.breadcrumbs.length > 0 && (
        <Breadcrumbs
          file={props.breadcrumbs[0].headline}
          nodes={breadcrumbsNodes}
        />
      )}
      {props.captureForm ? (
        <View>
          <Headline
            {...props.captureForm}
            level={editedNodeLevel}
            flat={true}
            selectable={true}
          />
          {props.captureForm.timestamps && (
            <AgendaDisplayLong linksDisabled={true} node={props.captureForm} />
          )}
        </View>
      ) : null}
    </View>
  );
});
