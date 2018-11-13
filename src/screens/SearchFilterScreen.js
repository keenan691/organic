import { Keyboard, ScrollView, Text, View } from "react-native";
import { connect } from "react-redux";
import Picker from "react-native-picker";
import R from "ramda";
import React, { Component } from "react";

import { Colors, Metrics } from "../themes";
import {
  NavigatorStyle,
  NavigatorStyleAlternative,
  NavigatorStyleMagenta
} from "../themes/ApplicationStyles";
import OrgSearcherFilterRedux, {
  SearchFilterSelectors
} from "../redux/OrgSearcherFilterRedux";
import OrgSearcherRedux from "../redux/OrgSearcherRedux";
import OrgWidgets from "../components/OrgWidgets";
import Section from "../components/Section";
import SectionListHeader from "../components/SectionListHeader";
import Separator from "../components/Separator";
import TextInput from "../components/TextInput";
import styles from "./styles/SearchScreenStyles";

// * Screen

class SearchFilterScreen extends Component {
  render() {
    const props = this.props;
    return (
      <ScrollView>
        <SectionListHeader title="Query" />
        <View style={{ marginTop: -11 }}>
          <Section separator>
            <View style={{ width: "100%" }}>
              <TextInput
                value={props.searchQuery.searchTerm}
                onChangeText={text =>
                  props.updateSearchQuery(["searchTerm"], text)
                }
                ref={view => (this.searchTerm = view)}
                // underlineColorAndroid={Colors.}
                placeholderTextColor={Colors.button}
                placeholder="Enter searched phrase..."
                onSubmitEditing={ev =>
                  props.updateSearchQuery(["searchTerm"], ev.nativeEvent.text)
                }
              />
            </View>
          </Section>

          <Section title="Tags" separator>
            <OrgWidgets.ThreeStatesSelectDialog
              rowsNum={3}
              onItemPress={(key, value) =>
                props.updateSearchQuery(["tags", key], value)
              }
              items={R.toPairs(props.searchQuery.tags)}
            />
          </Section>

          <Section title="Todo states" separator>
            <OrgWidgets.ThreeStatesSelectDialog
              rowsNum={2}
              onItemPress={(key, value) =>
                props.updateSearchQuery(["todos", key], value)
              }
              items={R.toPairs(props.searchQuery.todos)}
            />
          </Section>

          <Section title="Priorities" separator>
            <OrgWidgets.ThreeStatesSelectDialog
              rowsNum={1}
              label="Select priorities"
              onItemPress={(key, value) =>
                props.updateSearchQuery(["priority", key], value)
              }
              items={R.toPairs(props.searchQuery.priority)}
            />
          </Section>

          <Section title="Is scheduled?" separator>
            <OrgWidgets.OrgSwitch
              label="Is scheduled"
              value={props.searchQuery.isScheduled}
              onItemPress={value =>
                props.updateSearchQuery(["isScheduled"], value)
              }
            />
          </Section>

          <Section title="Has deadline?">
            <OrgWidgets.OrgSwitch
              value={props.searchQuery.hasDeadline}
              onItemPress={value =>
                props.updateSearchQuery(["hasDeadline"], value)
              }
            />
          </Section>
        </View>
      </ScrollView>
    );
  }
}

// * Redux

const mapStateToProps = R.applySpec({
  searchQuery: SearchFilterSelectors.getQuery,
  isQueryEmpty: SearchFilterSelectors.isQueryEmpty
});

const mapDispatchToProps = {
  updateSearchQuery: OrgSearcherFilterRedux.updateSearchQuery
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchFilterScreen);
