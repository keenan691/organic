import { createReducer, createActions } from 'reduxsauce'
import { createSelector } from 'reselect';
import Immutable from 'seamless-immutable'
import R from 'ramda';

// * Types and Action Creators

const { Types, Creators } = createActions({
  removeTodoState: null,
  addTodoState: null,
})

export const SettingsTypes = Types
export default Creators

// * Initial State

export const INITIAL_STATE = Immutable({
  unfinishedTaskStates: ['TODO', 'NEXT', 'PROJECT', 'BRAINSTORM', 'WAITING', 'IDEA', 'FIXME', 'REVIEW', 'SOMEDAY', 'MAYBE'],
  finishedTaskStates: ['DONE'],
  priorities: ['A', 'B', 'C'],
  pinnedTag: 'PIN',
  theme: 'bright',
  tags: [],
})

// * Selectors

const unfinishedTaskStates = state => state.settings.unfinishedTaskStates;
const finishedTaskStates = state => state.settings.finishedTaskStates;

const taskStates = createSelector(
  [unfinishedTaskStates, finishedTaskStates],
  (todo, done) => R.concat(todo, done)
);

export const SettingsSelectors = {
  userTags: state => state.settings.tags,
  taskStates,
}

// * Reducers

export const addTodoState = (state, action) => state.merge({  })
export const removeTodoState = (state, action) => state.merge({  })

// * Hookup Reducers To Types

export const reducer = createReducer(INITIAL_STATE, {
  [Types.REMOVE_TODO_STATE]: removeTodoState,
  [Types.ADD_TODO_STATE]: addTodoState,
 })
