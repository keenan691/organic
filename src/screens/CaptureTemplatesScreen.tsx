// * CaptureTemplateScreen.tsx

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
import EmptyList from '../components/EmptyList';
import SectionListHeader from '../components/SectionListHeader';
import Separator from '../components/Separator';
import messages from '../messages';
import CaptureRedux, { CaptureSelectors } from '../redux/CaptureRedux';
import { OrgDataSelectors } from '../redux/OrgDataRedux';
import { Colors, Fonts } from '../themes';
import styles from './styles/CaptureTemplatesScreenStyles';
import { CaptureTemplate } from '../redux/types';
import { Navigator } from 'react-native-navigation';

// ** Shape

interface CaptureTemplatesScreenProps {
  data: CaptureTemplate[];
  navigator: Navigator;
  showActions: (p: { item: CaptureTemplate }) => void;
  visit: (p: { item: CaptureTemplate; navigator: Navigator }) => void;
}

interface ItemProps {
  item: CaptureTemplate;
}

// ** Screen

class CaptureTemplatesScreen extends Component<CaptureTemplatesScreenProps> {
  constructor(props: CaptureTemplatesScreenProps) {
    super(props);
  }

  renderItem = ({ item }: ItemProps) => {
    return (
      <View style={styles.itemContainer}>
        <TouchableOpacity
          onLongPress={() => this.props.showActions({ item })}
          onPress={() =>
            this.props.visit({ item, navigator: this.props.navigator })
          }
        >
          <Text style={{ fontSize: Fonts.size.h6, color: Colors.fileText }}>
            {item.name}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    return (
      <View>
        <FlatList
          initialNumToRender={15}
          data={this.props.data}
          renderItem={this.renderItem}
          keyExtractor={(item) => item.name}
          ItemSeparatorComponent={Separator}
          ListHeaderComponent={() => <SectionListHeader title="Sinks" />}
          ListEmptyComponent={
            <EmptyList
              itemName={messages.sinks.vname}
              message={messages.sinks.description}
            />
          }
        />
      </View>
    );
  }
}

// ** Redux

const mapStateToProps = R.applySpec({
  data: CaptureSelectors.captureTemplates,
  files: OrgDataSelectors.getFiles,
});

const mapDispatchToProps = {
  visit: CaptureRedux.visitCaptureTemplate,
  showActions: CaptureRedux.showCaptureTemplateActions,
};

// * Exports

export default connect(mapStateToProps, mapDispatchToProps)(
  CaptureTemplatesScreen,
);
