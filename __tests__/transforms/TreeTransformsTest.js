// * Imports

import treeTransforms from "../../src/transforms/TreeTransforms";
import R from "ramda";
import Immutable from "seamless-immutable";

// * Default state

const state = Immutable({
  loadedNodesIds: [1, 2, 3, 4, 5, 6, 7],
  loadedNodesData: {
    1: {
      id: 1,
      level: 1,
      position: 1
    },
    2: {
      id: 2,
      level: 1,
      position: 2
    },

    3: {
      id: 3,
      level: 2,
      position: 3
    },
    4: {
      id: 4,
      level: 2,
      position: 4
    },
    5: {
      id: 5,
      level: 3,
      position: 5
    },
    6: {
      id: 6,
      level: 1,
      position: 6
    },
    7: {
      id: 7,
      level: 1,
      position: 7
    }
  }
});

const state2 = Immutable({
  loadedNodesIds: [1, 2, 3],
  loadedNodesData: {
    1: {
      id: 1,
      level: 1,
      position: 1
    },
    2: {
      id: 2,
      level: 2,
      position: 2
    },

    3: {
      id: 3,
      level: 1,
      position: 3
    }
  }
});

// * Test tools

const prepareResults = initialState => nodeField =>
  R.pipe(
    R.indexBy(R.prop("id")),
    R.merge(initialState.loadedNodesData, R.__),
    R.values,
    R.sortBy(R.prop("position")),
    R.map(R.prop(nodeField))
  );


const testFunction = (i, o, nodeField, initialState) => {
  expect(
    prepareResults(initialState || state)(nodeField)(
      treeTransforms.move(initialState || state, i)
    )
  ).toEqual(o);
};

// * Tests
// ** Horizontal Descendants Move

describe("Move node left/right", () => {

  test("do not move left - first level", () => {
    testFunction(
      {
        movedNodeId: 1,
        direction: "left"
      },
      [1, 1, 2, 2, 3, 1, 1],
      "level"
    );
  });

  test("do not move right - first level", () => {
    testFunction(
      {
        movedNodeId: 1,
        direction: "right"
      },
      [1, 1, 2, 2, 3, 1, 1],
      "level"
    );
  });

  test("do not move right - to far", () => {
    testFunction(
      {
        movedNodeId: 3,
        direction: "right"
      },
      [1, 1, 2, 2, 3, 1, 1],
      "level"
    );
  });

  test("do not move left - to close", () => {
    testFunction(
      {
        movedNodeId: 2,
        direction: "left"
      },
      [1, 1, 2, 2, 3, 1, 1],
      "level"
    );
  });

  test("right - prev node same level", () => {
    testFunction(
      {
        movedNodeId: 2,
        direction: "right"
      },
      [1, 2, 3, 3, 4, 1, 1],
      "level"
    );
  });

  test("right - last node", () => {
    testFunction(
      {
        movedNodeId: 7,
        direction: "right"
      },
      [1, 1, 2, 2, 3, 1, 2],
      "level"
    );
  });

  test("left", () => {
    testFunction(
      {
        movedNodeId: 5,
        direction: "left"
      },
      [1, 1, 2, 2, 2, 1, 1],
      "level"
    );
  });
  test("move left with prev node with same level", () => {
    testFunction(
      {
        movedNodeId: 4,
        direction: "left"
      },
      [1, 1, 2, 1, 2, 1, 1],
      "level"
    );
  });
});

// ** Vertical Descendants Move

describe("Move tree node up/down", () => {

  test("down", () => {
    testFunction(
      {
        movedNodeId: 1,
        direction: "down"
      },
      [2, 3, 4, 5, 1, 6, 7],
      "id"
    );
  });

  test("up to first position", () => {
    testFunction(
      {
        movedNodeId: 2,
        direction: "up"
      },
      [2, 3, 4, 5, 1, 6, 7],
      "id"
    );
  });

  test("down - to node without descendants", () => {
    testFunction(
      {
        movedNodeId: 2,
        direction: "down"
      },
      [1, 6, 2, 3, 4, 5, 7],
      "id"
    );
  });

  test("down - with subtree to end of file", () => {
    testFunction(
      {
        movedNodeId: 1,
        direction: "down"
      },
      [3, 1, 2],
      "id",
      state2
    );
  });

  test("up - no neighbours with same level", () => {
    testFunction(
      {
        movedNodeId: 5,
        direction: "up"
      },
      [1, 2, 3, 4, 5, 6, 7],
      "id"
    );
  });

  test("up - target has descendants", () => {
    testFunction(
      {
        movedNodeId: 6,
        direction: "up"
      },
      [1, 6, 2, 3, 4, 5, 7],
      "id"
    );
  });

});
// ** Vertical Free Node Move

describe("Move note without descendants up and down", () => {

  test("down", () => {
    testFunction(
      {
        movedNodeId: 1,
        direction: "down",
        withDescendants: false
      },
      [2, 1, 3, 4, 5, 6, 7],
      "id"
    );
  });

  test("up - first node", () => {
    testFunction(
      {
        movedNodeId: 1,
        direction: "up"
      },
      [1, 2, 3, 4, 5, 6, 7],
      "id"
    );
  });

  test("down - last node", () => {
    testFunction(
      {
        movedNodeId: 7,
        direction: "down"
      },
      [1, 2, 3, 4, 5, 6, 7],
      "id"
    );
  });

  test("up - last node", () => {
    testFunction(
      {
        movedNodeId: 7,
        direction: "up"
      },
      [1, 2, 3, 4, 5, 7, 6],
      "id"
    );
  });

  test("up - no neighbours with same level", () => {
    testFunction(
      {
        movedNodeId: 5,
        direction: "up"
      },
      [1, 2, 3, 4, 5, 6, 7],
      "id"
    );
  });
})

// ** Horizontal Free Note Move


describe("Horizontal free move", () => {

  test("do not move left - first level", () => {
    testFunction(
      {
        movedNodeId: 1,
        direction: "left",
        withDescendants: false
      },
      [1, 1, 2, 2, 3, 1, 1],
      "level"
    );
  });

  test("move right", () => {
    testFunction(
      {
        movedNodeId: 1,
        direction: "right",
        withDescendants: false
      },
      [2, 1, 2, 2, 3, 1, 1],
      "level"
    );
  });

})
