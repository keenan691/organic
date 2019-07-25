import { useState, useLayoutEffect } from 'react';
import { foldAnimation } from 'components/outliner/animations';
import { LayoutAnimation } from 'react-native';

export function useTabNavigation() {
  const [navigationState, setNavigationState] = useState({
  });
  const activeRoute = navigationState.routes[navigationState.index];

  return { navigationState, setNavigationState, activeRoute };
}
