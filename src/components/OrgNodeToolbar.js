import { Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import React from "react";

import { BatchEditActionButtons } from "../components/OrgNodesList";
import { showEditModal } from "../navigation";
import Separator from './Separator';
import styles from "./styles/OrgNodeToolbarStyles";

const ToolbarButton = ({ id, title, icon, onPressItem }) => {
  return (
    <TouchableOpacity
      style={{
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
      }}
      onPress={onPressItem}
    >
      <Icon name={icon} style={styles.toolbarButtonIcon} />
      <Text style={styles.toolbarButtonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const OrgNodeToolbar = ({ node, navigator, navigationStack }) => {
  return (
    <View>
      <View style={styles.nodeActionsToolbar}>
        {BatchEditActionButtons().map(action => (
          <ToolbarButton
            {...action}
            key={action.id}
            onPressItem={() => {
              // const selectedNodesIds = node.id;
              switch (action.id) {
                // case "delete":
                //   Alert.alert(
                //     "Delete",
                //     `Really delete ${selectedNodesIds.length} nodes?`,
                //     [
                //       {
                //         text: "OK",
                //         onPress: () => {
                //           this.props.runNodeAction(actionId, selectedNodesIds);
                //           this.clearSelection();
                //         }
                //       }
                //     ],
                //     { cancelable: true, onDismiss: () => this.showEditMenu() }
                //   );
                //   break;

                case "todo":
                  showEditModal(navigator, {
                    node,
                    editField: "todo",
                    title: "Select todos",
                    navigationStack

                    // onExit: this.showEditMenu.bind(this)
                  });
                  break;

                case "tags":
                  showEditModal(navigator, {
                    node,
                    editField: "tags",
                    title: "Select tags",
                    navigationStack
                    // onExit: this.showEditMenu.bind(this)
                  });
                  break;

                case "priority":
                  showEditModal(navigator, {
                    node,
                    editField: "priority",
                    title: "Select priority",
                    navigationStack
                    // onExit: this.showEditMenu.bind(this)
                  });
                  break;
              }
            }}
          />
        ))}
      </View>
      <Separator />
      </View>
  );
};

export default OrgNodeToolbar;
