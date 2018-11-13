// * OrgContent.tsx

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

import { NodeContentParser, ParsedInlineObject } from 'org-mode-connection';
import React, { ReactElement } from 'react';
import { Linking, Text } from 'react-native';
import { vibrate } from '../vibrations';
import styles from './styles/OrgContentStyles';

// ** Shape

interface OrgContentProps {
  content: string;
  asHeadline?: boolean;
}

interface LinesCreators {
  [name: string]: (
    children: React.ReactNode[],
    key: number,
  ) => ReactElement<any>;
}

interface InlinesCreators {
  [name: string]: (obj: ParsedInlineObject, key: number) => ReactElement<any>;
}

// ** Helpers

// *** Lines creators

const linesCreators: LinesCreators = {
  numericListLine: (children, key) =>
    createText({ key, style: styles.regularLine }, children),
  checkboxLine: (children, key) =>
    createText({ key, style: styles.checkboxLine }, children),
  regularLine: (children, key) =>
    createText({ key, style: styles.regularLine }, children),
  listLine: (children, key) =>
    createText({ key, style: styles.regularLine }, children),
};

// *** Inlines creators

const inlineElements: InlinesCreators = {
  strikeThroughText: (obj, key) =>
    createText(
      { key, style: { textDecorationLine: 'line-through' } },
      obj.content,
    ),
  underlineText: (obj, key) =>
    createText(
      { key, style: { textDecorationLine: 'underline' } },
      obj.content,
    ),
  verbatimText: (obj, key) =>
    createText({ key, style: { fontWeight: 'bold' } }, obj.content),
  regularText: (obj, key) => createText({ key }, obj.content),
  italicText: (obj, key) =>
    createText({ key, style: { fontStyle: 'italic' } }, obj.content),
  plainLink: (obj, key) =>
    createText(
      {
        key,
        onPress: () => openUrl(obj.url),
        style: styles.link,
      },
      obj.url,
    ),
  codeText: (obj, key) =>
    createText({ key, style: { fontWeight: 'bold' } }, obj.content),
  boldText: (obj, key) =>
    createText({ key, style: { fontWeight: 'bold' } }, obj.content),
  webLink: (obj, key) =>
    createText(
      {
        key,
        style: styles.link,
        onPress: () => openUrl(obj.url),
      },
      obj.title,
    ),
};

// *** Others

const createText = (props: object, children: any[] | string) =>
  React.createElement(Text, props, children);

const openUrl = (url: string) => {
  vibrate();
  Linking.openURL(url).catch((err) => console.error('An error occurred', err));
};

const createInlineElements = (line: ParsedInlineObject[]) =>
  line.map((obj, idx) => inlineElements[obj.type](obj, idx));

// ** Component

const OrgContent: React.StatelessComponent<OrgContentProps> = (props) => {
  // Transform string with org content to objects
  if (!props.content) {
    return null;
  }

  const parsedLines = NodeContentParser(props.content.trim() || '');

  // Create React Native objects
  if (props.asHeadline)
    return linesCreators['regularLine'](
      createInlineElements(parsedLines[0].content),
      1,
    );

  const lineElements = parsedLines.map((line, idx) =>
    linesCreators[line.type](createInlineElements(line.content), idx),
  );
  return linesCreators['regularLine'](lineElements, 1);
};

// * Exports

export default OrgContent;
