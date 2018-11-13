// * OrgNode.tsx

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

import React, { PureComponent } from 'react';
import { TouchableHighlight, View } from 'react-native';
import OrgContent from './OrgContent';
import { Headline } from './Headline';
import {
  getHeadlineIconName,
  OrgNodesListItem,
} from '../containers/OrgNodesList';
import styles from '../containers/styles/OrgNodesListStyles';

// ** Shape

interface Props {
  flat: boolean;
  item: OrgNodesListItem;
  onPressItem: (id: string) => void;
  showContent: () => void;
}

// ** Component

export class OrgNode extends PureComponent<Props> {
  render() {
    const { flat, item, onPressItem, showContent = false } = this.props;
    const content = item.content.trim();
    return (
      <View>
        <TouchableHighlight
          underlayColor={'white'}
          style={[styles.nodeContainer, styles[item.role + 'NodeBg']]}
          onPress={() => onPressItem(item.id)}
        >
          <Headline
            flat={flat}
            iconName={getHeadlineIconName(item)}
            showEllipsis={item.hasHiddenChildren}
            {...item}
          />
        </TouchableHighlight>

        {showContent && content ? (
          <View style={styles.nodeContainer}>
            <OrgContent content={content} />
          </View>
        ) : null}
      </View>
    );
  }
}
