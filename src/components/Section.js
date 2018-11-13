import { Text, View } from "react-native";
import React from "react";

import Separator from "./Separator";
import styles from "./styles/SectionStyles";

export const SectionTitle = (props) => {
  return (
    <Text style={styles.titleText}>{props.title}</Text>
  )
}

const Section = props => {
  return (
    <View>
      <View style={styles.section}>
        {props.title ? (
          <SectionTitle title={props.title}/>
        ) : null}
        {props.children}
      </View>
      {props.separator ? <Separator /> : null}
    </View>
  );
};

export default Section;
