import { Linking, Text, TouchableOpacity, View } from "react-native";
import R from "ramda";
import React from "react";

import { NodeContentParser } from "org-mode-connection";

import { vibrate } from '../vibrations';
import styles from "./Styles/OrgContentStyles";

const openUrl = url => {
  vibrate();
  Linking.openURL(url).catch(err => console.error("An error occurred", err));
};

const createText = (props, children) =>
  React.createElement(Text, props, children);

const lines = {
  numericListLine: (children, key) =>
    createText({ key, style: styles.regularLine }, children),
  checkboxLine: (children, key) =>
    createText({ key, style: styles.checkboxLine }, children),
  regularLine: (children, key) =>
    createText({ key, style: styles.regularLine }, children),
  listLine: (children, key) =>
    createText({ key, style: styles.regularLine }, children)
};

const inlineElements = {
  strikeThroughText: (obj, key) =>
    createText(
      { key, style: { textDecorationLine: "line-through" } },
      obj.content
    ),
  underlineText: (obj, key) =>
    createText(
      { key, style: { textDecorationLine: "underline" } },
      obj.content
    ),
  verbatimText: (obj, key) =>
    createText({ key, style: { fontWeight: "bold" } }, obj.content),
  regularText: (obj, key) => createText({ key }, obj.content),
  italicText: (obj, key) =>
    createText({ key, style: { fontStyle: "italic" } }, obj.content),
  plainLink: (obj, key) =>
    createText(
      {
        key,
        onPress: () => openUrl(obj.url),
        style: styles.link
      },
      obj.url
    ),
  codeText: (obj, key) =>
    createText({ key, style: { fontWeight: "bold" } }, obj.content),
  boldText: (obj, key) =>
    createText({ key, style: { fontWeight: "bold" } }, obj.content),
  webLink: (obj, key) =>
    createText(
      {
        key,
        style: styles.link,
        onPress: () => openUrl(obj.url)
      },
      obj.title
    )
};

const OrgContent = props => {
  // Transform string with org content to objects
  if (!props.content) return "";
  const parsedLines = NodeContentParser(props.content.trim() || "");
  const parseLineContent = R.addIndex(R.map)((obj, idx) =>
    inlineElements[obj.type](obj, idx)
  );

  // Create React Native objects
  return props.asHeadline
    ? parseLineContent(parsedLines[0].content)
    : parsedLines.map((line, idx) =>
        lines[line.type](parseLineContent(line.content), idx)
      );
};

export default OrgContent;
