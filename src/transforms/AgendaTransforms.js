// * Agenda Functions
// * Imports

import moment from "moment";
import R from "ramda";

// * Move

const move = (number, interval) => (node, tsType) => {
  const timestamps = R.indexBy(R.prop("type"), node.timestamps);
  let newTimestamps = {};
  if (timestamps[tsType]) {
    newTimestamps = {
      ...timestamps,
      [tsType]: {
        ...timestamps[tsType],
        date:
          number === 0
            ? moment().toISOString()
            : moment(timestamps[tsType].date)
                .add(number, interval)
                .toISOString()
      }
    };
  } else {
    newTimestamps = {
      [tsType]: {
        date:
          number === 0
            ? moment().toISOString()
            : moment()
                .add(number, interval)
                .toISOString(),
        type: tsType
      }
    };
  }
  const res = {
    ...node,
    timestamps: R.values(newTimestamps)
  };
  return res;
};

export const toOrgDate = ({ date }) => moment(date).format("YYYY-MM-DD");

export const tTimestamp = {
  toString: ts => {
    let res = ts.dateWithTime
      ? moment(ts.date).format("YYYY-MM-DD HH:mm")
      : moment(ts.date).format("YYYY-MM-DD");
    if (ts.repeater) {
      res = res + " " + ts.repeater.toUpperCase();
    }
    return res;
  }
};

export const tRepeater = {
  toObject: R.pipe(
    R.match(/^(\.*\+{1,2})(\d+)([hmdwy])$/),
    R.applySpec({
      type: R.nth(1),
      multiplicator: R.nth(2),
      period: R.nth(3)
    })
  ),
  toString: obj => R.pipe()
};

// * set todo

const tsLens = R.lensProp("timestamps");

const removeClosedTimestamp = node => changes => {
  const timestamps = R.pipe(
    R.when(R.isNil, R.always([])),
    R.reject(R.propEq("type", "closed"))
  )(node.timestamps);
  return {
    ...changes,
    timestamps
  };
};

const addClosedTimestamp = node => changes => {
  const timestamps = R.pipe(
    R.when(R.isNil, R.always([])),
    R.reject(R.propEq("type", "closed")),
    R.append({
      type: "closed",
      date: moment().toISOString(),
      dateWithTime: true
    })
  )(node.timestamps);
  return {
    ...changes,
    timestamps
  };
};

const nodeP = {
  isDone: R.propEq("todo", "DONE"),
  isRepetable: R.pipe(
    R.prop("timestamps"),
    R.reject(R.propSatisfies(R.isNil, "repeater")),
    R.length,
    R.gt(R.__, 0)
  )
};

const translatePeriodToMoment = period => (period === "m" ? "M" : period);

// TODO repeatToStyle
const repeatDate = now =>
  R.pipe(
    R.evolve({
      // log todo state change
      timestamps: R.converge(R.concat, [
        /* ------------- ts without repeaters ------------- */
        R.filter(R.propSatisfies(R.isNil, "repeater")),
        /* ------------- ts with repeaters ------------- */
        R.pipe(
          R.reject(R.propSatisfies(R.isNil, "repeater")),
          R.map(ts => {
            const { type, multiplicator, period } = tRepeater.toObject(
              ts.repeater
            );
            const momentPeriod = translatePeriodToMoment(period);
            const tsDate = moment(ts.date);
            let newDate;
            switch (type) {
              case "+":
                newDate = tsDate.add(multiplicator, momentPeriod);
                break;
              case "++":
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
              case ".+":
                newDate = moment(now)
                  .add(multiplicator, momentPeriod)
                  .set("minute", tsDate.minutes())
                  .set("hour", tsDate.hour())
                  .set("seconds", tsDate.seconds())
                  .set("milliseconds", tsDate.milliseconds());
                break;
            }
            return {
              ...ts,
              date: newDate.toISOString()
            };
          })
        )
      ])
    })
  );

const formatDate = date => moment(date).format("YYYY-MM-DD ddd hh:mm");

export const setTodo = (newTodo, node = {}, now) => {
  if (!now) now = moment();

  let changes = R.pipe(
    // merge todo state
    // create/remove closed timestamps
    R.ifElse(
      () => nodeP.isRepetable(node) && node.todo != null && node.todo != "DONE",
      R.merge({
        timestamps: repeatDate(now)(node).timestamps,
        content:
          `\n- State "${newTodo}"       from "${node.todo}"       [${formatDate(
            now
          )}]` + node.content,
        metadata: JSON.stringify(
          R.merge(JSON.parse(node.metadata || "{}"), {
            LAST_REPEAT: `[${formatDate(now)}]`
          })
        )
      }),
      R.pipe(
        R.merge({
          todo: newTodo
        }),
        R.cond([
          [nodeP.isDone, addClosedTimestamp(node)],
          [R.complement(nodeP.isDone), removeClosedTimestamp(node)],
          [R.T, R.identity]
        ])
      )
    )
  )({});
  return changes;
};

// * export default

export default {
  move
};
