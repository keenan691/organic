// * OrgNodesListTests
import React from 'react';
/* import { shallow } from 'enzyme'; */
import renderer from 'react-test-renderer';
import { OrgNodesList, OrgNodesListItem } from '../../src/containers/OrgNodesList';
/* import configureStore from 'redux-mock-store' */
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { FlingGestureHandler } from 'react-native-gesture-handler';
import { mock, instance } from 'ts-mockito'
// create any initial state needed

import * as Factory from "factory.ts";

const itemFactory = Factory.Sync.makeFactory<OrgNodesListItem>({
  id: Factory.each(i => i).toString(),
  headline: 'test',
  todo: '',

});

const initialState = {};
// here it is possible to pass in any middleware if needed into //configureStore
/* const mockStore = configureStore(); */
let wrapper;
let store;

// * All
// * Mocks
const navigator = {
  addOnNavigatorEvent: jest.fn(),
  push: jest.fn(),
  setStyle: jest.fn()
};
jest.mock('react-native-gesture-handler', () => ({
  Directions: { RIGHT: 1, LEFT: 3 },
  FlingGestureHandler: (props) => props.children,
  TapGestureHandler: (props) => props.children,
}));
/* jest.mock('Directions', () => ( { RIGHT: 1, LEFT: 2} )); */
beforeEach(() => {
  //creates the store with any initial state or middleware needed
  /* store = mockStore(initialState) */
  /* wrapper = see below... */
});

// * Tests
// ** cycle mode
// *** from default
// *** to agenda
// *** to outline
// *** as sectionList
// *** as flatList
// **
// ** change mode

test('renders correctly', () => {
  const data = [];
  const wrapper = shallow(
    <OrgNodesList
      useFlatList={true}
      navigator={navigator}
      data={data}
    />,
  );
  const componentInstance = wrapper.instance();
  console.log(componentInstance.getCurrentMode())
                 console.log(wrapper.state())
                 console.log(wrapper.props())
  expect(toJson(wrapper)).toMatchSnapshot('renders with empty data')

  /* const tree = renderer.create(<OrgNodesList
   *                                useFlatList={true}
   *                                data={data}
   *                                navigator={navigator} />).toJSON(); */
  /* expect(tree).toMatchSnapshot(); */
});

console.log(itemFactory.build())
test('renders correctly', () => {
  const data = [itemFactory.build(), itemFactory.build()];
  const wrapper = shallow(
    <OrgNodesList
      useFlatList={true}
      navigator={navigator}
      data={data}
    />,
  );
  const componentInstance = wrapper.instance();
  console.log(componentInstance.getCurrentMode())
  console.log(wrapper.state())
  console.log(wrapper.props())
  componentInstance.onLongPress(data[0])

  console.log(wrapper.state())
  // expect(toJson(wrapper)).toMatchSnapshot('renders with empty data')

  /* const tree = renderer.create(<OrgNodesList
   *                                useFlatList={true}
   *                                data={data}
   *                                navigator={navigator} />).toJSON(); */
  /* expect(tree).toMatchSnapshot(); */
});
