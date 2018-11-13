// * OrgNodePerformant.tsx

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

import React from 'react';
import R from 'ramda';
import { PureComponent } from 'react';
import { Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import OrgContent from './OrgContent';
import { Colors, Metrics } from '../themes';
import { getFileTitle } from '../utils/files';
import AgendaDisplay from './AgendaDisplay';
import { AgendaTodayDisplay } from './AgendaTodayDisplay';
import {
  getHeadlineIconName,
  OrgNodesListItem,
} from '../containers/OrgNodesList';
import styles from '../containers/styles/OrgNodesListStyles';
import { Tags } from './Tags';
import { PlainOrgFile } from 'org-mode-connection';

// ** Shape

interface OrgNodePerformantProps {
  files: { [fileId: string]: PlainOrgFile };
  flat: boolean;
  heights: { [nodeId: string]: number };
  hideAgenda: boolean;
  item: OrgNodesListItem;
  now: string;
  selected: boolean;
  showCategory: boolean;
}

// ** Component

export class OrgNodePerformant extends PureComponent<OrgNodePerformantProps> {
  render() {
    const {
      flat,
      item,
      selected,
      hideAgenda,
      showCategory = false,
      files,
    } = this.props;
    const baseLevel = item.baseLevel || 1;
    const levelMargin = flat ? 0 : 28 * (item.level - baseLevel);
    const headlineStyle = [
      flat ? styles.h0 : styles[`h${item.level}`],
      { marginLeft: levelMargin },
    ];
    const height = this.props.heights[item.id];
    const nodeStyles = [
      {
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: Metrics.doubleBaseMargin,
        paddingVertical: Metrics.baseMargin,
        height,
      },
    ];

    selected && nodeStyles.push({ backgroundColor: Colors.white });

    return (
      <View style={nodeStyles}>
        <Text style={headlineStyle}>
          <Icon
            name={getHeadlineIconName(item)}
            style={[headlineStyle, styles.icon]}
          />
          {'  '}
          {item.todo && (
            <Text
              style={[styles.todo, item.todo === 'DONE' ? styles.doneText : {}]}
            >
              {item.todo}{' '}
            </Text>
          )}
          {item.priority && (
            <Text style={styles.priority}>[#{item.priority}] </Text>
          )}

          <Text>
            <OrgContent content={item.headline} asHeadline={true} />
          </Text>
          <Tags data={item.tags} />
        </Text>
        <View style={styles.categoryContainer}>
          {showCategory ? (
            <Text style={styles.category}>
              {getFileTitle(files[item.fileId])}
            </Text>
          ) : null}
        </View>

        <View style={styles.agendaContainer}>
          {hideAgenda ? (
            <AgendaTodayDisplay node={item} now={this.props.now} />
          ) : (
            <AgendaDisplay node={item} />
          )}
        </View>
        <View style={{}}>
          {item.hasHiddenChildren && (
            <Icon style={headlineStyle} name="ios-arrow-forward" />
          )}
        </View>
      </View>
    );
  }

  shouldComponentUpdate(nextProps: OrgNodePerformantProps) {
    if (
      R.equals(this.props.item, nextProps.item) &&
      nextProps.selected === this.props.selected
    ) {
      return false;
    }
    return true;
  }
}
