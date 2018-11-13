import { Text, TouchableOpacity, View } from "react-native";
import { connect } from "react-redux";
import { pure } from "recompose";
import React from "react";

import { Colors } from "../themes";
import { navigateToOrgElement } from "../navigation";
import OrgContent from "./OrgContent";
import styles from "./styles/BreadcrumbsStyles";

// If no fileObj is passed Breadcrumbs is treaten as static and is rendered without links
const Breadcrumbs = props => {
  return (
    <Text style={[styles.breadcrumbs, props.styles]}>
      <Text
        style={{
          fontWeight: "bold",
          color: Colors.fileText
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
                props.navigationStack
              )
            }
            style={{
              textDecorationLine: "underline",
              color: Colors.headlineText[idx]
            }}
          >
            <OrgContent content={node.headline} asHeadline />
          </Text>
        </Text>
      ))}
    </Text>
  );
};

Breadcrumbs.propTypes = {};

Breadcrumbs.defaultProps = {};

export default pure(Breadcrumbs);
