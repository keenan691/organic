// * PinnedScreen.tsx

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
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import Separator from '../components/Separator';
import messages from '../messages';
import { navigateToOrgElement } from '../navigation';
import CaptureRedux from '../redux/CaptureRedux';
import OrgDataRedux, { OrgDataSelectors } from '../redux/OrgDataRedux';
import { Colors } from '../themes';
import { getFileTitle } from '../utils/files';
import styles from './styles/PinnedScreenStyles';

// ** Shape
// ** Screen

class PinnedScreen extends Component {
  render() {
    return (
      <FlatList
        initialNumToRender={15}
        data={this.props.data}
        renderItem={this.renderItem}
        keyExtractor={(item) => item.name}
        ItemSeparatorComponent={Separator}
        ListEmptyComponent={(props) => {
          return (
            <Text style={styles.itemContainer}>
              {messages.marks.description}
            </Text>
          );
        }}
      />
    );
  }

  renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onLongPress={() => this.props.showActions(item)}
        onPress={() => {
          this.props.navigator.toggleDrawer({ to: 'closed' });
          navigateToOrgElement(
            this.props.navigator,
            item.fileId,
            item.id,
            'notes',
          );
        }}
      >
        <View style={styles.itemContainer}>
          <Text>{item.headline}</Text>
          <Text
            style={{
              color: Colors.cyan,
            }}
          >
            {getFileTitle(this.props.files[item.fileId])}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  shouldComponentUpdate(nextPromp, prevProps) {
    return true;
  }
}

// ** Redux

const mapStateToProps = R.applySpec({
  data: OrgDataSelectors.getMarkedPlaces,
  files: OrgDataSelectors.getFiles,
});

const mapDispatchToProps = {
  runNodeAction: OrgDataRedux.runNodeAction,
  showActions: CaptureRedux.showCaptureTemplateActions,
};

// * Exports

export default connect(mapStateToProps, mapDispatchToProps)(PinnedScreen);
