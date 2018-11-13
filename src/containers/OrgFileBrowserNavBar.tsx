// * OrgFileBrowserNavBar.tsx

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
import { Slider, Text, View } from 'react-native';
import { connect } from 'react-redux';
import Switch from '../components/Switch';
import { OrgDataSelectors } from '../redux/OrgDataRedux';
import { Colors } from '../themes';
import styles from '../screens/styles/OrgFileBrowserNavBarStyles';

// ** Shape
// ** Component

class OrgFileBrowserNavBar extends Component {
  render() {
    const minLevel = 1;
    const maxLevel = 5;
    return (
      <View style={styles.container}>
        <View style={{ flex: 3 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ color: Colors.menuButton }}>Details: </Text>
            <Slider
              value={this.props.foldingLevel}
              step={1}
              minimumValue={minLevel}
              maximumValue={maxLevel}
              thumbTintColor={Colors.menuButton}
              minimumTrackTintColor={Colors.menuButton}
              maximumTrackTintColor={Colors.menuButton}
              style={{ width: '60%' }}
              onSlidingComplete={(val) => this.props.setFoldingLevel(val)}
            />
          </View>
        </View>
        <Switch
          iconName="ios-funnel"
          label="Sink"
          onPress={this.props.markAsSink}
          active={this.props.isSink}
        />
        {!this.props.hideMark && (
          <Switch
            iconName="ios-bookmark"
            label="Mark"
            onPress={this.props.toggleMark}
            active={this.props.isPlaceMarked}
          />
        )}
      </View>
    );
  }
}

// ** Redux

const mapStateToProps = R.applySpec({
  isDataLoaded: OrgDataSelectors.isDataLoaded,
});

const mapDispatchToProps = {};

// * Export

export default connect(mapStateToProps, mapDispatchToProps)(
  OrgFileBrowserNavBar,
);
