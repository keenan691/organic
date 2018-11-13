// * TreeTransforms.ts

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

import R from 'ramda';
import { PlainOrgNodesDict, PlainOrgNode } from 'org-mode-connection';

// * Shape

interface Data {
  loadedNodesIds: string[];
  loadedNodesData: PlainOrgNodesDict;
}

interface Move {
  movedNodeId: string;
  direction: 'up' | 'down' | 'left' | 'right';
  withDescendants: boolean;
}

interface Props {
  ids: string[];
  nodes: PlainOrgNodesDict;
}

// * Helpers

const getNextNode = (selectedId: string, { ids, nodes }: Props) => {
  const isLast = (idx: number) => idx === ids.length - 1;
  return R.pipe(
    R.findIndex(R.equals(selectedId)),
    R.ifElse(
      isLast,
      () => undefined,
      R.pipe(R.inc, (idx) => ids[idx], (id) => nodes[id]),
    ),
  )(ids);
};

const getPrevNode = (
  selectedId: string,
  { ids, nodes }: Props,
): PlainOrgNode | undefined => {
  const isFirst = (idx: number) => idx === 0;
  return R.pipe(
    R.findIndex(R.equals(selectedId)),
    R.ifElse(
      isFirst,
      () => undefined,
      R.pipe(R.dec, (idx) => ids[idx], (id) => nodes[id]),
    ),
  )(ids);
};

export const getNextNodeSameLevel = (
  selectedId: string,
  { ids, nodes }: Props,
) =>
  R.pipe(
    R.dropWhile(R.complement(R.equals(selectedId))),
    R.drop(1),
    R.find((id) => nodes[id].level === nodes[selectedId].level),
  )(ids);

export const getPrevNodeSameLevel = (
  selectedId: string,
  { ids, nodes }: Props,
) =>
  R.pipe(
    R.reverse,
    // @ts-ignore
    R.dropWhile(R.complement(R.equals(selectedId))),
    R.drop(1),
    R.find((id) => nodes[id].level === nodes[selectedId].level),
  )(ids);

const exchangePositions = (node1: PlainOrgNode, node2: PlainOrgNode) => {
  return [
    R.merge(node1, { position: node2.position }),
    R.merge(node2, { position: node1.position }),
  ];
};

// Returns selected node and its descendants ids
const getDescendants = (selectedId: string, { nodes, ids }: Props) =>
  R.pipe(
    R.dropWhile((id) => id !== selectedId),
    R.drop(1),
    R.takeWhile((id) => nodes[id].level > nodes[selectedId].level),
    R.prepend(selectedId),
  )(ids);

// * Construction Block Functions

const moveHorizontally = (
  direction: Move['direction'],
  idsToMove: string[],
  data: Props,
) => {
  let newProps;
  let changedNodes = [];
  const prevNode = getPrevNode(idsToMove[0], data);
  const selectedNode = data.nodes[idsToMove[0]];

  switch (direction) {
    case 'left':
      if (
        prevNode &&
        selectedNode.level - 1 >= 1 &&
        prevNode.level <= selectedNode.level
      ) {
        newProps = R.map((id) => ({
          level: data.nodes[id].level - 1,
        }))(idsToMove);
      }
      break;

    case 'right':
      if (prevNode && selectedNode.level <= prevNode.level) {
        newProps = R.map((id) => ({
          level: data.nodes[id].level + 1,
        }))(idsToMove);
      }
      break;
  }

  if (newProps) {
    changedNodes = idsToMove.map((id, idx) => ({
      ...data.nodes[id],
      ...newProps[idx],
    }));
  }

  return changedNodes;
};

const moveFreeVertically = (
  direction: Move['direction'],
  idToMove: string,
  data: Props,
) => {
  const targetNode =
    direction === 'down'
      ? getNextNode(idToMove, data)
      : getPrevNode(idToMove, data);
  if (!targetNode) {
    return [];
  }
  const changedNodes = exchangePositions(data.nodes[idToMove], targetNode);
  return changedNodes;
};

const moveFreeHorizontally = (
  direction: Move['direction'],
  idToMove: string,
  data: Props,
) => {
  const node = data.nodes[idToMove];
  let changedNodes;
  if (direction === 'left') {
    if (node.level < 2) {
      return [];
    }
    changedNodes = [R.merge(node, { level: node.level - 1 })];
  } else {
    changedNodes = [R.merge(node, { level: node.level + 1 })];
  }
  return changedNodes;
};

const moveVertically = (
  direction: Move['direction'],
  idsToMove: string[],
  data: Props,
) => {
  let insertRange;
  let interval;
  let newProps;
  let changedNodes: PlainOrgNode[] = [];

  // Numeric representation of move - needed to reverse move
  let directionNumRepr = direction === 'down' ? 1 : -1;
  const targetNode =
    direction === 'down'
      ? getNextNodeSameLevel(idsToMove[0], data)
      : getPrevNodeSameLevel(idsToMove[0], data);

  if (!targetNode) {
    return changedNodes;
  }

  let targetIds = getDescendants(targetNode, data);

  // Reverse move if target have less descendants to move
  if (idsToMove.length > targetIds.length) {
    let temp = idsToMove;
    directionNumRepr = -directionNumRepr;
    idsToMove = targetIds;
    targetIds = temp;
  }

  switch (directionNumRepr) {
    // Down
    case 1:
      insertRange = [
        data.nodes[R.last(targetIds)].position + 1e-15,
        R.propOr(
          data.nodes[data.ids[data.ids.length - 1]].position + 1,
          'position',
          getNextNode(R.last(targetIds), data),
        ) - 1e-15,
      ];
      interval = (insertRange[1] - insertRange[0]) / (idsToMove.length + 1);

      newProps = R.map((idx) => ({
        position: insertRange[0] + (idx + 1) * interval,
      }))(R.range(0, idsToMove.length));
      break;

    // Up
    case -1:
      insertRange = [
        R.propOr(0, 'position', getPrevNode(targetIds[0], data)) + 1e-15,
        data.nodes[targetIds[0]].position - 1e-15,
      ];

      interval = (insertRange[1] - insertRange[0]) / (idsToMove.length + 1);

      newProps = R.map((idx) => ({
        position: insertRange[0] + (idx + 1) * interval,
      }))(R.range(0, idsToMove.length));
      // console.tron.log(newProps);

      break;
  }

  if (newProps) {
    changedNodes = idsToMove.map((id, idx) => ({
      ...data.nodes[id],
      ...newProps[idx],
    }));
  }

  return changedNodes;
};

// * Main function

const move = (
  { loadedNodesData, loadedNodesIds }: Data,
  { movedNodeId, direction, withDescendants = true }: Move,
) => {
  const data = {
    nodes: loadedNodesData,
    ids: loadedNodesIds,
  };

  const moveType = ['up', 'down'].includes(direction)
    ? 'vertical'
    : 'horizontal';

  let changedNodes = [];

  // TODO use withoutDescendants
  const idsToMove = withDescendants
    ? getDescendants(movedNodeId, data)
    : movedNodeId;

  switch (moveType) {
    case 'horizontal':
      changedNodes = withDescendants
        ? moveHorizontally(direction, idsToMove, data)
        : moveFreeHorizontally(direction, idsToMove, data);
      break;
    case 'vertical':
      changedNodes = withDescendants
        ? moveVertically(direction, idsToMove, data)
        : moveFreeVertically(direction, movedNodeId, data);
      break;
  }

  return changedNodes;
};

export default {
  move,
};
