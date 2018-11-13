// * TODO save this as default test template
// * Imports

import R from "ramda";
import moment from "moment";

import { setTodo } from "../../src/transforms/AgendaTransforms";

// * Mocks

console.tron = {
  warn: () => null,
  log: () => null
};

// * Tools
// * Components
// ** Timestamps

const date = moment("2018-10-06 02:54").toISOString();
const today = moment("2018-10-06 02:54");
const weekBeforeToday = moment("2018-10-06 02:54");

const closedTs = {
  type: "closed",
  date: expect.any(String),
  dateWithTime: true
};

const scheduledTs = args => ({
  type: "scheduled",
  date,
  ...args
});

const deadlineTs = {
  type: "deadline",
  date
};

// ** Nodes

const content =
  "Fusce sagittis, libero non molestie mollis, magna orci ultrices dolor, at vulputate neque nulla lacinia eros. ";

const nodeTODO = {
  todo: "TODO",
  content,
  timestamps: [deadlineTs]
};

const nodeTODOscheduled = {
  todo: "TODO",
  content,
  timestamps: [scheduledTs()]
};

const nodeTODOscheduledRep = rep => ({
  todo: "TODO",
  content,
  timestamps: [scheduledTs({ repeater: rep })]
});

const nodeDONE = {
  todo: "DONE",
  content,
  timestamps: [closedTs, deadlineTs]
};

// * Tests

// ** basic

const basicTests = [
  setTodo,
  [
    ["DONE", nodeTODO],
    {
      todo: "DONE",
      timestamps: [deadlineTs, closedTs]
    }
  ],

  [
    ["TODO", nodeDONE],
    {
      todo: "TODO",
      timestamps: [deadlineTs]
    }
  ]
];

// ** repeaters

const addToToday = (a, b) =>
  moment(date)
    .add(a, b)
    .toISOString();

const repeaterTests = [
  (repeater, todayDate) =>
    setTodo("DONE", nodeTODOscheduledRep(repeater), todayDate).timestamps[0]
      .date,
  [
    ["+1d"],
    moment(date)
      .add(1, "d")
      .toISOString()
  ],
  [
    ["+1w"],
    moment(date)
      .add(1, "w")
      .toISOString()
  ],
  [
    ["+1m"],
    moment(date)
      .add(1, "M")
      .toISOString()
  ],
  [
    ["+1y"],
    moment(date)
      .add(1, "y")
      .toISOString()
  ],
  [
    // One moth after today
    ["+1m", addToToday(2, "d")],
    addToToday(1, "M")
  ],
  // TODO write test for ++ and .+ and for repeattostyle
  [[".+10d", addToToday(2, "d")], addToToday(10 + 2, "d")],
  [[".+5d", addToToday(20, "d")], addToToday(20 + 5, "d")],
  [["++20d", addToToday(10, "d")], addToToday(10 + 10, "d")]
];

// ** scheduled

const scheduledTests = [
  (...args) => setTodo(...args, today),
  [
    ["DONE", nodeTODOscheduled],
    {
      todo: "DONE",
      timestamps: [scheduledTs(), closedTs]
    }
  ],
  [
    ["DONE", nodeTODOscheduledRep("+1w")],
    {
      content:
        `- State "DONE"       from "TODO"       [${today.format(
          "YYYY-MM-DD ddd hh:mm"
        )}]\n` + content,
      metadata: JSON.stringify({
        LAST_REPEAT: `[${today.format("YYYY-MM-DD ddd hh:mm")}]`
      }),
      timestamps: [
        scheduledTs({
          date: addToToday(1, "w"),
          repeater: "+1w"
        })
      ]
    }
  ]
];

// * runner

// TODO uncomment those tests
test("setTodo", () => {
  const suits = [
    // basicTests,
                 // scheduledTests,
                 repeaterTests];

  for (const suit of suits) {
    const [runner, ...tests] = suit;
    for (const test of tests) {
      const [args, result] = test;
      expect(runner(...args)).toEqual(result);
    }
  }
});
