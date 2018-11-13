// * Breadcrumbs.tsx

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
import { Text } from 'react-native';
import { pure } from 'recompose';
import { navigateToOrgElement } from '../navigation';
import { Colors } from '../themes';
import OrgContent from './OrgContent';
import styles from './styles/BreadcrumbsStyles';
import { OrgNodesListItem } from '../containers/OrgNodesList';
import { Navigator } from 'react-native-navigation'
import { PlainOrgFile } from 'org-mode-connection';

// TODO If no fileObj is passed Breadcrumbs is treaten as static and is rendered without links

// ** Shape

interface BreadcrumbsProps {
  styles?:  object;
  file:  string;
  navigator: Navigator;
  nodes: OrgNodesListItem[];
  fileObj: PlainOrgFile;
  navigationStack: string;
}

// ** Component

const Breadcrumbs: React.StatelessComponent<BreadcrumbsProps> = (props) => {
  return (
    <Text style={[styles.breadcrumbs, props.styles]}>
      <Text
        style={{
          fontWeight: 'bold',
          color: Colors.fileText,
        }}
      >
        {props.file}
      </Text>
      {props.nodes.map((node, idx) => (
        <Text>
          <Text> / </Text>
          <Text
            onPress={() =>
              navigateToOrgElement(
                props.navigator,
                props.fileObj.id,
                node.id,
                props.navigationStack,
              )
            }
            style={{
              textDecorationLine: 'underline',
              color: Colors.headlineText[idx],
            }}
          >
            <OrgContent content={node.headline} asHeadline={true} />
          </Text>
        </Text>
      ))}
    </Text>
  );
};

// * Exports

export default pure(Breadcrumbs);
