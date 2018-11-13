// * LastCapturedScreen.tsx

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

// ** Imports

import R from 'ramda';
import React, { Component } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import EmptyList from '../components/EmptyList';
import SectionListHeader from '../components/SectionListHeader';
import OrgNodesList from '../containers/OrgNodesList';
import OrgDataRedux, { OrgDataSelectors } from '../redux/OrgDataRedux';
import { Colors, Fonts } from '../themes';
import { getFileTitle } from '../utils/files';
import styles from './styles/LastCapturedScreenStyles';

// ** Shape
// ** Screen

class LastCapturedScreen extends Component {
  static navigatorStyle = {
    navBarHidden: true,
  };

  onNavigatorEvent = (event) => {
    if (event.type === 'ScreenChangedEvent') {
      switch (event.id) {
        case 'didAppear':
      }
    }

    if (event.type === 'NavBarButtonPress') {
      switch (event.id) {
        case 'cancel':
          break;
      }
    }
  };

  constructor(props) {
    super(props);
    this.props.navigator.addOnNavigatorEvent(this.onNavigatorEvent);
  }

  renderItem = ({ item }) => {
    return (
      <View style={styles.itemContainer}>
        <TouchableOpacity
          onLongPress={() => this.props.showActions(item)}
          onPress={() => this.props.visit(item, this.props.navigator)}
        >
          <Text style={{ fontSize: Fonts.size.h5 }}>{item.name}</Text>
          <Text>
            <Text
              style={{
                color: Colors.cyan,
              }}
            >
              {getFileTitle(this.props.files[item.target.fileId])}
            </Text>
            {item.name !== item.target.headline ? (
              <Text>
                <Text>/</Text>
                <Text style={{ color: Colors.magenta }}>
                  {item.target.headline}
                </Text>
              </Text>
            ) : null}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    console.tron.log('render last captured');
    return (
      <View>
        <OrgNodesList
          {...this.props}
          useFlatList={true}
          navBarHidden={true}
          data={this.props.items}
          navigator={this.props.navigator}
          runNodeAction={this.props.runNodeAction}
          // ref={view => (this.nodesList = view)}
          flat={true}
          navigationStack="notes"
          dataStack="lastCaptured"
          dismissEditMenu={this.showMenu}
          ListHeaderComponent={() => (
            <View style={{ marginBottom: 8 }}>
              <SectionListHeader title="Last Notes" />
            </View>
          )}
          ListEmptyComponent={
            <EmptyList
              itemName="Last notes"
              // message={messages.sinks.description}
            />
          }
        />
      </View>
    );
  }
}

// ** Redux

const mapStateToProps = R.applySpec({
  items: OrgDataSelectors.getLastCapturedNotes,
});

const mapDispatchToProps = {
  runNodeAction: OrgDataRedux.runNodeActionRequest,
};

// * Export

export default connect(mapStateToProps, mapDispatchToProps)(LastCapturedScreen);
