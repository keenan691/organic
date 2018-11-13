// * OrgNodeEditScreen.tsx

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
import { Text, TouchableWithoutFeedback, View } from 'react-native';
import { connect } from 'react-redux';
import { lifecycle } from 'recompose';
import { change } from 'redux-form';
import CaptureRedux from '../redux/CaptureRedux';
import OrgDataRedux, { OrgDataSelectors } from '../redux/OrgDataRedux';
import { SettingsSelectors } from '../redux/SettingsRedux';
import { setTodo } from '../transforms/AgendaTransforms';
import AgendaInput from '../components/AgendaInput';
import { PriorityInput } from '../components/PriorityInput';
import styles from './styles/OrgNodeEditScreenStyles';
import { TagsInput } from '../components/TagsInput';
import { TodoInput } from '../components/TodoInput';
import { ModalAction } from '../components/ModalAction';

// ** Shape

// ** Constants

const EMPTY_VALUES = {
  tags: [],
  timestamps: [],
  todo: null,
  priority: null,
};

// ** Helpers

const dismissLightBoxOnStateChange = lifecycle({
  componentDidUpdate() {
    setTimeout(this.props.finalize, 100);
  },
});

const AutoclosingTodoInput = dismissLightBoxOnStateChange(TodoInput);
const AutoclosingPriorityInput = dismissLightBoxOnStateChange(PriorityInput);

const MODAL_INPUTS = {
  timestamps: (props) => <AgendaInput rowsNum={3} {...props} />,
  todo: (props) => <AutoclosingTodoInput rowsNum={3} {...props} />,
  tags: (props) => <TagsInput rowsNum={4} {...props} />,
  priority: (props) => <AutoclosingPriorityInput {...props} />,
};

const REGULAR_INPUTS = {
  todo: (props) => <TodoInput rowsNum={3} {...props} />,
  tags: (props) => <TagsInput rowsNum={6} {...props} />,
  priority: (props) => <PriorityInput {...props} />,
};

// ** Screen

export class OrgNodeEditScreen extends Component {
  static navigatorStyle = {
    statusBarHidden: false,
  };
  static defaultProps = {
    navigationStack: 'notes',
  };

  constructor(props) {
    super(props);
    const editedElementVal =
      R.pathOr(undefined, ['node', this.props.editField], props) ||
      EMPTY_VALUES[this.props.editField];

    this.state = {
      editedNode: {
        [this.props.editField]: editedElementVal,
      },
      userInput: '',
    };
  }

  static getDerivedStateFromProps(props) {
    switch (props.navigationStack) {
      default:
        if (props.targetNode) {
          return {
            editedNode: props.targetNode,
          };
        }
    }
  }

  updateNode = (obj) => {
    this.setState((state) => ({
      editedNode: obj,
    }));
  };

  renderAsModal(WrappedComponent, title) {
    const Widget = MODAL_INPUTS[this.props.editField];

    return (
      <TouchableWithoutFeedback onPress={this.props.dismissAction}>
        <View style={styles.modalBg}>
          <TouchableWithoutFeedback onPress={() => null}>
            <View style={styles.modalContainer}>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitleText}>{this.props.title}</Text>
                  {this.props.nodesIds && (
                    <Text style={styles.normalText}>
                      Change {this.props.editField} of{' '}
                      {this.props.nodesIds.length} objects.
                    </Text>
                  )}
                  <Widget
                    {...this.props}
                    updateNode={this.updateForm}
                    updateUserInput={(text) =>
                      this.setState((state) => ({ userInput: text }))
                    }
                    node={this.state.editedNode}
                    userInput={this.state.userInput}
                    finalize={this.finalize}
                  />
                </View>
              </View>
              <View style={styles.modalActionsContainer}>
                <ModalAction onPress={this.props.dismissAction} text="CANCEL" />
                <ModalAction onPress={this.clear} text="CLEAR" />
                <ModalAction onPress={this.finalize} text="OK" />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    );
  }

  renderAsSection() {
    const Widget = REGULAR_INPUTS[this.props.editField];
    return (
      <Widget
        {...this.props}
        onItemPress={this.updateForm}
        ref={(view) => (this.widget = view)}
        updateCaptureForm={this.props.updateCaptureForm}
        node={this.state.editedNode}
      />
    );
  }

  updateForm = (newVal) => {
    let changes;

    switch (this.props.editField) {
      case 'tags':
        const tags = new Set(this.state.editedNode.tags);
        tags.has(newVal) ? tags.delete(newVal) : tags.add(newVal);
        changes = {
          tags: Array.from(tags),
        };
        break;
      case 'todo':
        if (this.props.node) {
          changes = setTodo(newVal, this.props.node);
        } else {
          changes = {
            [this.props.editField]: newVal,
          };
        }
        break;
      default:
        changes = {
          [this.props.editField]: newVal,
        };
    }

    this.setState((state) => ({
      editedNode: R.merge(this.state.editedNode, changes),
    }));
  };

  render() {
    return this.props.asModal ? this.renderAsModal() : this.renderAsSection();
  }

  clear = () => {
    let changes;

    if (this.props.editField === 'timestamps') {
      let tsType = this.props.type;
      // FIXME
      if (tsType === 'schedule') {
        tsType = 'scheduled';
      }
      changes = R.reject(
        (ts) => ts.type === tsType,
        this.state.editedNode.timestamps,
      );
    } else {
      changes = EMPTY_VALUES[this.props.editField];
    }

    const newData = R.merge(this.state.editedNode, {
      [this.props.editField]: changes,
    });

    this.setState(
      (state) => ({
        editedNode: newData,
      }),
      this.finalize,
    );
  };

  finalize = () => {
    switch (this.props.navigationStack) {
      /* ------------- updates capture form ------------- */
      case 'capture':
        this.props.change(
          'capture',
          this.props.editField,
          this.state.editedNode[this.props.editField],
        );
        this.props.dismissAction();
        break;

      /* ------------- updates directly edited node ------------- */
      default:
        if (this.state.editedNode.id) {
          this.props.updateNode(
            this.state.editedNode,
            undefined,
            this.props.navigationStack,
          );
        } else {
          this.props.updateNode(
            this.state.editedNode,
            this.props.nodesIds,
            this.props.navigationStack,
          );
        }

        this.props.dismissAction();
    }
  };

  componentWillUnmount() {
    if (this.props.onExit) {
      this.props.onExit();
    }
  }
}

// ** Redux

const mapStateToProps = R.applySpec({
  tagsChoices: OrgDataSelectors.getTags,
  taskStates: SettingsSelectors.taskStates,
});

const mapDispatchToProps = {
  updateNode: OrgDataRedux.updateNode,
  updateCaptureForm: CaptureRedux.updateCaptureForm,
  change,
};

// * Export

export default connect(mapStateToProps, mapDispatchToProps)(OrgNodeEditScreen);
