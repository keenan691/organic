// * Section.tsx

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
import { Text, View } from 'react-native';
import Separator from './Separator';
import styles from './styles/SectionStyles';

// ** Shape

interface SectionTitleProps {
  title: string;
}

interface SectionProps {
  title: string;
  children: any;
  separator: boolean;
}

// ** Components

const SectionTitle: React.StatelessComponent<SectionTitleProps> = (props) => {
  return <Text style={styles.titleText}>{props.title}</Text>;
};

const Section: React.StatelessComponent<SectionProps> = (props) => {
  return (
    <View>
      <View style={styles.section}>
        {props.title ? <SectionTitle title={props.title} /> : null}
        {props.children}
      </View>
      {props.separator ? <Separator /> : null}
    </View>
  );
};

// * Exports

export { SectionTitle };
export default Section;
