import { RootAction } from 'store/types';
import { Reactotron } from 'reactotron-core-client';

type ReactotronReduxCustomCommand = [string, RootAction][]

const customCommands: ReactotronReduxCustomCommand = [
  ['dispatch3', { type: 'startup/STARTUP' }]
]

const executeReduxAction = async (action: RootAction) => {
  const store = (await import('store')).default
  store.dispatch(action)
}

export const registerReactotronCustomCommands = (reactotron: Reactotron) => {
  for (const [commandName, action] of customCommands) {
    reactotron.onCustomCommand(commandName, () => executeReduxAction(action))
  }
}

export function logAction(action: any) {
  return console.tron.display({
    name: `${action.type.split('/')[0]}`.toUpperCase(),
    preview: `${action.type.split('/')[1]} | ${action.payload}`,
    important: true,
    value: action,
  });
}
