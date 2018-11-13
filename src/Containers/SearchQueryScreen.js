import { Image, View, Text } from "react-native";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import R from "ramda";
import React from "react";

import { SearchFilterSelectors } from '../redux/OrgSearcherFilterRedux';
import OrgWidgets from "../Components/OrgWidgets";
import styles from "./Styles/SearchQueryScreenStyles";

const SearchQueryScreen = props => {
 // console.tron.log("rendering filters");
  return (
    <View>
      <OrgWidgets.ThreeStatesSelectDialog
        rowsNum={3}
        label="Select tags"
        onItemPress={(key, value) =>
          props.updateSearchQuery(["tags", key], value)
        }
        items={R.toPairs(props.searchQuery.tags)}
      />
      <OrgWidgets.ThreeStatesSelectDialog
        rowsNum={2}
        label="Select todos"
        onItemPress={(key, value) =>
          props.updateSearchQuery(["todos", key], value)
        }
        items={R.toPairs(props.searchQuery.todos)}
      />
      <OrgWidgets.ThreeStatesSelectDialog
        rowsNum={1}
        label="Select priorities"
        onItemPress={(key, value) =>
          props.updateSearchQuery(["priority", key], value)
        }
        items={R.toPairs(props.searchQuery.priority)}
      />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between"
        }}
      >
        <OrgWidgets.OrgSwitch
          label="Has deadline"
          value={props.searchQuery.hasDeadline}
          onItemPress={value => props.updateSearchQuery(["hasDeadline"], value)}
        />
        <OrgWidgets.OrgSwitch
          label="Is scheduled"
          value={props.searchQuery.isScheduled}
          onItemPress={value => props.updateSearchQuery(["isScheduled"], value)}
        />
      </View>
    </View>
  );
};

const mapStateToProps = R.applySpec({
  searchQuery: SearchFilterSelectors.getQuery,
});

const mapDispatchToProps = {
  // openSearchResult: OrgDataRedux.openFileRequest,
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchQueryScreen);
