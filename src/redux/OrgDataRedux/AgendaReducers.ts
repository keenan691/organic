// * AgendaReducers.ts

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

// ** Tasks

// *** TODO type
// *** TODO refactor to switch case

// ** Code

import moment from 'moment';
import R from 'ramda';

export const DAY_FORMAT = 'YYYY-MM-DD';

export const loadDayAgenda = (state, { date }) => {
  return state.merge({
    timestampsRange: {
      start: moment(date).format(DAY_FORMAT),
      end: moment(date).format(DAY_FORMAT),
    },
  });
};

export const loadWeekAgenda = (state, { date }) => {
  return state
    .merge({
      timestampsRange: {
        start: moment(date)
          .startOf('week')
          .format(DAY_FORMAT),
        end: moment(date)
          .endOf('week')
          .format(DAY_FORMAT),
      },
    })
    .setIn(['isDataLoaded', 'agenda'], false);
};

export const rescheduleAgenda = (
  state,
  { changes: { timestamps }, nodesIds },
) => {
  const reject = (range) =>
    R.reject((ts) => {
      const date = moment(ts.date);
      return (
        date.isBefore(range.start, 'day') || date.isAfter(range.end, 'day')
      );
    });

  const rejectIfNotInRange = reject(state.timestampsRange);

  const rejectIfNotToday = reject({ start: moment(), end: moment() });

  const newAgendaTimestamps = R.pipe(
    rejectIfNotInRange,
    R.chain(({ type }) => nodesIds.map((nodeId) => ({ nodeId, type }))),
  )(timestamps);

  const newDayAgendaTimestamps = R.pipe(
    rejectIfNotToday,
    R.chain(({ type }) => nodesIds.map((nodeId) => ({ nodeId, type }))),
  )(timestamps);

  const transform = (prevState) =>
    R.pipe(
      R.reject((ts) => nodesIds.includes(ts.nodeId)),
      R.concat(prevState),
    );

  const agendaName = 'timestamps';

  return state.merge({
    timestamps: transform(newAgendaTimestamps)(state.timestamps),
    dayTimestamps: transform(newDayAgendaTimestamps)(state.dayTimestamps),
  });
};

export const updateTimestamps = (
  state,
  { agendaItems, dayAgendaItems, range },
) => {
  return state.merge({
    timestamps: agendaItems,
    dayTimestamps: dayAgendaItems,
    timestampsRange: range,
  });
};

// * Export

export default {
  loadWeekAgenda,
  loadDayAgenda,
  rescheduleAgenda,
  updateTimestamps,
};
