import {FAB, Button} from 'react-native-paper'
import {Navigation} from 'react-native-navigation'
import {View, Text, LayoutAnimation} from 'react-native'
import {sourcesSelectors} from 'redux/sources'
import {useSelector} from 'react-redux'
import Animated from 'react-native-reanimated'
import BottomSheet from 'reanimated-bottom-sheet'
import React, {useEffect, useCallback, useState, useRef, Fragment, memo} from 'react'

import {Empty} from 'elements'
import {foldAnimation} from 'components/outliner/animations'
import STRINGS from 'constants/strings'

import styles from './styles'

type Props = {}

export type Layouts = 'one' | 'two'

const name = {
  mount: 0,
  nothing: 1,
  addButtonVisible: 2,
}

function SourcesManager(props: Props) {
  const [layout, setLayout] = useState<Layouts>(name.mount)

  const status = useSelector(sourcesSelectors.getStatus)
  const data = useSelector(sourcesSelectors.getData)

  const setLayoutWihEffects = val => {
    setLayout(val)
    if (val > name.mount) LayoutAnimation.configureNext(foldAnimation)
  }

  const onPressCallback = useCallback(() => {
    /* setLayoutWihEffects(name.nothing); */
    bottomSheetRef.current.snapTo(2)
  }, [])

  useEffect(() => {
    if (layout === name.mount) {
      setTimeout(() => {
        setLayoutWihEffects(name.nothing)
      }, 0)
      setTimeout(() => {
        setLayoutWihEffects(name.addButtonVisible)
      }, 100)
    } else {
    }
  }, [layout])

  const onClose = useRef(() => {
    console.tron.debug('close')
  })
  const bottomSheetRef = useRef<BottomSheet | null>(null)
  const callbackNode = useRef(new Animated.Value(1))
  const callbackNode1 = useRef(new Animated.Value(1))
  Animated.useCode(
    Animated.onChange(
      callbackNode.current,
      Animated.block([
        Animated.cond(
          Animated.greaterOrEq(callbackNode.current, 1),
          Animated.set(
            callbackNode1.current,
            Animated.add(Animated.multiply(-10, callbackNode.current)),
          ),
          /* Animated.call([], () => {
           *   onClose.current && onClose.current();
           * }), */
        ),
      ]),
    ),
    [onClose],
  )
  const bs = useRef(null)
  const newLocal = {
    inputRange: [0.9, 1],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  }
  return (
    <Fragment >
      <BottomSheet
        ref={bottomSheetRef}
        callbackNode={callbackNode.current}
        snapPoints={[500, 200, 100, 20]}
        renderContent={() => (
          <View style={styles.panel}>
            <Button
              mode="contained"
              onPress={() => {
                bottomSheetRef.current.snapTo(3)
                Navigation.showModal({
                  stack: {children: [{component: {name: 'sources/WebDavSource'}}]},
                })
              }}>
              WebDAV
            </Button>
            <Button mode="contained" onPress={() => null}>
              Resillo Sync
            </Button>
          </View>
        )}
        initialSnap={3}
        enabledGestureInteraction={true}
      />
      <View style={[styles.fabWrapper]}>
        {layout === name.addButtonVisible ? (
          <Animated.View
            style={{
              transform: [
                {
                  scaleX: callbackNode.current.interpolate(newLocal),
                },
                {
                  scaleY: callbackNode.current.interpolate(newLocal),
                },
              ],
            }}>
            <FAB style={styles.fab} icon="add" onPress={onPressCallback} />
          </Animated.View>
        ) : null}
      </View>
    </Fragment>
  )
}

export default memo(SourcesManager)
