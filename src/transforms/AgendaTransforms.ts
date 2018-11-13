// * AgendaTransforms.ts

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

// * Imports

import moment, { Moment } from 'moment';
import R from 'ramda';
import { PlainOrgNode, PlainOrgTimestamp } from 'org-mode-connection';

// * Move

const move = (mul: number, interval: string) => (
  node: PlainOrgNode,
  tsType: PlainOrgTimestamp['type'],
) => {
  const timestamps = R.indexBy(R.prop('type'), node.timestamps);
  let newTimestamps = {};
  if (timestamps[tsType]) {
    newTimestamps = {
      ...timestamps,
      [tsType]: {
        ...timestamps[tsType],
        date:
          mul === 0
            ? moment().toISOString()
            : moment(timestamps[tsType].date)
                .add(mul, interval)
                .toISOString(),
      },
    };
  } else {
    newTimestamps = {
      [tsType]: {
        date:
          mul === 0
            ? moment().toISOString()
            : moment()
                .add(mul, interval)
                .toISOString(),
        type: tsType,
      },
    };
  }
  const res = {
    ...node,
    timestamps: R.values(newTimestamps),
  };
  return res;
};

export const toOrgDate = ({ date }) => moment(date).format('YYYY-MM-DD');

export const tTimestamp = {
  toString: (ts: PlainOrgTimestamp) => {
    let res = ts.dateWithTime
      ? moment(ts.date).format('YYYY-MM-DD HH:mm')
      : moment(ts.date).format('YYYY-MM-DD');
    if (ts.repeater) {
      res = res + ' ' + ts.repeater.toUpperCase();
    }
    return res;
  },
};

export const translateRepeater = {
  toObject: R.pipe(
    R.match(/^(\.*\+{1,2})(\d+)([hmdwy])$/),
    R.applySpec({
      type: R.nth(1),
      multiplicator: R.nth(2),
      period: R.nth(3),
    }),
  ),
  toString: (obj) => R.pipe(),
};

// * set todo

const removeClosedTimestamp = (node: PlainOrgNode) => (changes: Object) => {
  const timestamps = R.pipe(
    R.when(R.isNil, R.always([])),
    R.reject(R.propEq('type', 'closed')),
  )(node.timestamps);
  return {
    ...changes,
    timestamps,
  };
};

const addClosedTimestamp = (node: PlainOrgNode) => (changes: Object) => {
  const timestamps = R.pipe(
    R.when(R.isNil, R.always([])),
    R.reject(R.propEq('type', 'closed')),
    R.append({
      type: 'closed',
      date: moment().toISOString(),
      dateWithTime: true,
    }),
  )(node.timestamps);
  return {
    ...changes,
    timestamps,
  };
};

const nodeP = {
  isDone: R.propEq('todo', 'DONE'),
  isRepetable: R.pipe(
    R.prop('timestamps'),
    R.reject(R.propSatisfies(R.isNil, 'repeater')),
    R.length,
    R.gt(R.__, 0),
  ),
};

const translatePeriodToMoment = (period: string) =>
  period === 'm' ? 'M' : period;

// TODO repeatToStyle
const repeatDate = (now: string | Moment) =>
  R.pipe(
    R.evolve({
      // log todo state change
      timestamps: R.converge(R.concat, [
        /* ------------- ts without repeaters ------------- */
        R.filter(R.propSatisfies(R.isNil, 'repeater')),
        /* ------------- ts with repeaters ------------- */
        R.pipe(
          R.reject(R.propSatisfies(R.isNil, 'repeater')),
          R.map((ts: PlainOrgTimestamp) => {
            const { type, multiplicator, period } = translateRepeater.toObject(
              ts.repeater,
            );
            const momentPeriod = translatePeriodToMoment(period);
            const tsDate = moment(ts.date);
            let newDate;
            switch (type) {
              case '+':
                newDate = tsDate.add(multiplicator, momentPeriod);
                break;
              case '++':
                // TODO
                if (tsDate.isBefore(now)) {
                  newDate = tsDate;
                  while (newDate.isBefore(now)) {
                    newDate.add(multiplicator, momentPeriod);
                  }
                } else {
                  newDate = tsDate.add(multiplicator, momentPeriod);
                }
                break;
              case '.+':
                newDate = moment(now)
                  .add(multiplicator, momentPeriod)
                  .set('minute', tsDate.minutes())
                  .set('hour', tsDate.hour())
                  .set('seconds', tsDate.seconds())
                  .set('milliseconds', tsDate.milliseconds());
                break;
            }
            return {
              ...ts,
              date: newDate.toISOString(),
            };
          }),
        ),
      ]),
    }),
  );

const formatDate = (date: Date | string) =>
  moment(date).format('YYYY-MM-DD ddd hh:mm');

export const setTodo = (
  newTodo: string,
  node: PlainOrgNode,
  now: string | Moment,
) => {
  if (!now) {
    now = moment();
  }

  let changes = R.pipe(
    // merge todo state
    // create/remove closed timestamps
    R.ifElse(
      () => nodeP.isRepetable(node) && node.todo != null && node.todo != 'DONE',
      R.merge({
        timestamps: repeatDate(now)(node).timestamps,
        content:
          `\n- State "${newTodo}"       from "${node.todo}"       [${formatDate(
            now,
          )}]` + node.content,
        metadata: JSON.stringify(
          R.merge(JSON.parse(node.metadata || '{}'), {
            LAST_REPEAT: `[${formatDate(now)}]`,
          }),
        ),
      }),
      R.pipe(
        R.merge({
          todo: newTodo,
        }),
        R.cond([
          [nodeP.isDone, addClosedTimestamp(node)],
          [R.complement(nodeP.isDone), removeClosedTimestamp(node)],
          [R.T, R.identity],
        ]),
      ),
    ),
  )({});
  return changes;
};

// * export default

export default {
  move,
};
