// * AgendaInput.tsx

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

import moment from 'moment';
import { TimestampType } from 'org-mode-connection';
import R from 'ramda';
import React, { Component } from 'react';
import { View } from 'react-native';
import { OrgNodesListItem } from '../containers/OrgNodesList';
import { showDatePickerDialog, showRepeaterDialog, showTimePicker } from '../utils/pickers';
import { SetClearWidget } from './SetClearWidget';

// ** Shape

interface AgendaInputProps {
  node: OrgNodesListItem;
  updateNode: (object: any) => any;
  type: TimestampType
}

// ** Helpers

const toDate = (val: string) => new Date(val);
const toIsoString = (date: Date) => date.toISOString();

const repeaterR = /\s*([\+\.]+)(\d+)([ywmdh])?/;

const extractRepeater = (val: string) =>
  R.isNil(val) ? undefined : repeaterR.exec(val).slice(1, 4);

const emptyAgendaObject = (type: TimestampType) => ({
  type,
  warningPeriod: undefined,
  repeater: undefined,
  date: undefined,
  dateRangeEnd: undefined,
  dateRangeWithTime: undefined,
  dateWithTime: undefined,
});

// ** Component

export default class AgendaInput extends Component<AgendaInputProps> {
  get = (type: TimestampType) => {
    return (
      R.find(R.propEq('type', type), this.props.node.timestamps) ||
      emptyAgendaObject(type)
    );
  };

  set = (type: TimestampType) => (newObj: object) => {
    const timestamps = R.pipe(
      R.reject(R.propEq('type', type)),
      R.append(newObj),
    )(this.props.node.timestamps);
    this.props.updateNode(timestamps);
  };

  renderSection(type: TimestampType) {
    const get = this.get(type);
    const set = this.set(type);
    return (
      <View style={{ flexDirection: 'column' }}>
        <SetClearWidget
          label="Date"
          field="date"
          selectedValue={new Date()}
          outTransform={toIsoString}
          inTransform={toDate}
          data={get}
          dialog={showDatePickerDialog}
          setHandler={set}
          display={(val) => moment(val).format('YYYY-MM-DD')}
        />

        <SetClearWidget
          separator={true}
          disabled={get.date ? false : true}
          label="Time"
          field="date"
          selectedValue={new Date()}
          outTransform={toIsoString}
          inTransform={toDate}
          data={get}
          dialog={showTimePicker}
          setHandler={R.pipe(R.merge(R.__, { dateWithTime: true }), set)}
          clearHandler={R.pipe(R.merge(R.__, { dateWithTime: false }), set)}
          display={(val, data) => {
            return get.dateWithTime ? moment(val).format('hh:mm') : 'none';
          }}
        />
        <SetClearWidget
          separator={true}
          label="Repeater"
          field="repeater"
          disabled={get.date ? false : true}
          selectedValue="+1d"
          outTransform={(val) => {
            return val ? val.join('') : undefined;
          }}
          inTransform={extractRepeater}
          data={get}
          dialog={showRepeaterDialog}
          setHandler={set}
        />
      </View>
    );
  }

  render() {
    switch (this.props.type) {
      case 'deadline':
        return this.renderSection('deadline');
      // FIXME this is type somewhere in the code - should be `scheduled`
      case 'schedule':
        return this.renderSection('scheduled');
    }
  }
}
