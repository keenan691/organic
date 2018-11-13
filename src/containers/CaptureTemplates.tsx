// * CaptureTemplates.tsx

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
import messages from '../messages';
import CaptureRedux, { CaptureSelectors } from '../redux/CaptureRedux';
import NavigationRedux, { NavigationSelectors } from '../redux/NavigationRedux';
import { CaptureTemplate } from '../redux/types';
import styles from './styles/CaptureTemplatesStyles';

// ** Shape

interface CaptureTemplatesProps {
  selected: string;
  data: typeof CaptureSelectors.captureTemplates;
  handleAction: (payload: object) => void;
  onPressItem: (itemId: string) => void;
}

interface ItemProps {
  index: number;
  item: CaptureTemplate;
}

// ** Const

const NUM_COLUMNS = 3;

// ** Helpers

const createBorder = (direction: string) => {
  switch (direction) {
    case 'left':
      return { borderLeftWidth: 1 };
    case 'right':
      return { borderRightWidth: 1 };
    case 'top':
      return { borderTopWidth: 1 };
    case 'bottom':
      return { borderBottomWidth: 1 };
  }
};

const addInnerBorder = (styles, { indexItem, numItems, numColumns }) => {
  const numRows = Math.ceil(numItems / numColumns);
  const currentRowIndex = Math.floor(indexItem / numColumns);
  const isLastRow = () => currentRowIndex === numRows - 1;
  const currentColumnIndex = indexItem % numColumns;
  const isLastColumn = () => currentColumnIndex === numColumns - 1;

  return R.pipe(
    R.when(R.complement(isLastRow), R.append(createBorder('bottom'))),
    R.when(R.complement(isLastColumn), R.append(createBorder('right'))),
  )(styles);
};

// ** Component

class CaptureTemplates extends Component<CaptureTemplatesProps> {
  renderItem = (props: ItemProps) => {
    const { item, index } = props;
    const numItems = this.props.data.length;
    const itemStyles = [styles.item];
    if (item.name === this.props.selected) {
      itemStyles.push(styles.selected);
    }
    return (
      <TouchableOpacity
        onLongPress={() => this.props.handleAction({ item })}
        onPress={() => this.props.onPressItem({ id: item.name })}
      >
        <View
          style={addInnerBorder(itemStyles, {
            indexItem: index,
            numItems,
            numColumns: NUM_COLUMNS,
          })}
        >
          <Text style={[styles.itemTitle, styles[item.type]]}>{item.name}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    return (
      <View>
        <FlatList
          data={this.props.data}
          keyExtractor={(item: CaptureTemplate) => item.name}
          renderItem={this.renderItem}
          numColumns={NUM_COLUMNS}
          contentContainerStyle={styles.contentContainer}
          extraData={this.props.selected}
          ListEmptyComponent={
            <EmptyList
              itemName={messages.captureTemplates.vname}
              message={messages.captureTemplates.description}
            />
          }
        />
      </View>
    );
  }
}

// ** Connect

const mapStateToProps = R.applySpec({
  data: CaptureSelectors.captureTemplates,
  selected: NavigationSelectors.getSelectedCaptureTemplate,
});

const mapDispatchToProps = {
  onPressItem: NavigationRedux.selectCaptureTemplateRequest,
  handleAction: CaptureRedux.showCaptureTemplateActions,
};

// * Exports

export default connect(mapStateToProps, mapDispatchToProps)(CaptureTemplates);
