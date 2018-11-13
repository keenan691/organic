// * SearchFilterScreen.tsx

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
import { ScrollView, View } from 'react-native';
import { connect } from 'react-redux';
import OrgWidgets from '../components/OrgWidgets';
import Section from '../components/Section';
import SectionListHeader from '../components/SectionListHeader';
import TextInput from '../components/TextInput';
import OrgSearcherFilterRedux, {
  SearchFilterSelectors,
} from '../redux/OrgSearcherFilterRedux';
import { Colors } from '../themes';

// ** Shape
// ** Screen

class SearchFilterScreen extends Component {
  render() {
    const props = this.props;
    return (
      <ScrollView>
        <SectionListHeader title="Query" />
        <View style={{ marginTop: -11 }}>
          <Section separator={true}>
            <View style={{ width: '100%' }}>
              <TextInput
                value={props.searchQuery.searchTerm}
                onChangeText={(value) =>
                  props.updateSearchQuery({ path: ['searchTerm'], value })
                }
                ref={(view) => (this.searchTerm = view)}
                // underlineColorAndroid={Colors.}
                placeholderTextColor={Colors.button}
                placeholder="Enter searched phrase..."
                onSubmitEditing={(ev) =>
                  props.updateSearchQuery({
                    path: ['searchTerm'],
                    value: ev.nativeEvent.text,
                  })
                }
              />
            </View>
          </Section>

          <Section title="Tags" separator={true}>
            <OrgWidgets.ThreeStatesSelectDialog
              rowsNum={3}
              onItemPress={(key, value) =>
                props.updateSearchQuery({ path: ['tags', key], value })
              }
              items={R.toPairs(props.searchQuery.tags)}
            />
          </Section>

          <Section title="Todo states" separator={true}>
            <OrgWidgets.ThreeStatesSelectDialog
              rowsNum={2}
              onItemPress={(key, value) =>
                props.updateSearchQuery({ path: ['todos', key], value })
              }
              items={R.toPairs(props.searchQuery.todos)}
            />
          </Section>

          <Section title="Priorities" separator={true}>
            <OrgWidgets.ThreeStatesSelectDialog
              rowsNum={1}
              label="Select priorities"
              onItemPress={(key, value) =>
                props.updateSearchQuery({ path: ['priority', key], value })
              }
              items={R.toPairs(props.searchQuery.priority)}
            />
          </Section>

          <Section title="Is scheduled?" separator={true}>
            <OrgWidgets.OrgSwitch
              label="Is scheduled"
              value={props.searchQuery.isScheduled}
              onItemPress={(value) =>
                props.updateSearchQuery({ path: ['isScheduled'], value: value })
              }
            />
          </Section>

          <Section title="Has deadline?">
            <OrgWidgets.OrgSwitch
              value={props.searchQuery.hasDeadline}
              onItemPress={(value) =>
                props.updateSearchQuery({ path: ['hasDeadline'], value })
              }
            />
          </Section>
        </View>
      </ScrollView>
    );
  }
}

// ** Redux

const mapStateToProps = R.applySpec({
  searchQuery: SearchFilterSelectors.getQuery,
  isQueryEmpty: SearchFilterSelectors.isQueryEmpty,
});

const mapDispatchToProps = {
  updateSearchQuery: OrgSearcherFilterRedux.updateSearchQuery,
};

// * Exports

export default connect(mapStateToProps, mapDispatchToProps)(SearchFilterScreen);
