// * OrgFilesScreen.tsx

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

import { PlainOrgFile } from 'org-mode-connection';
import R from 'ramda';
import React, { Component } from 'react';
import { FlatList } from 'react-native';
import { Navigator } from 'react-native-navigation';
import { connect } from 'react-redux';
import EmptyList from '../components/EmptyList';
import SectionListHeader from '../components/SectionListHeader';
import Separator from '../components/Separator';
import messages from '../messages';
import OrgDataRedux, { OrgDataSelectors } from '../redux/OrgDataRedux';
import { SyncSelectors } from '../redux/SyncRedux';
import { Colors } from '../themes';
import { OrgFile } from '../components/OrgFile';

// ** Shape

interface OrgFilesScreenProps {
  changedFiles: object[];
  externallyChangedFiles: object[];
  files: { [id: string]: PlainOrgFile };
  filesIds: string[];
  loadToc: () => void;
  navigator: Navigator;
  showActionsDialog: () => void;
}

// ** Screen

class OrgFilesScreen extends Component<OrgFilesScreenProps> {
  constructor(props: OrgFilesScreenProps) {
    super(props);
  }

  componentDidUpdate() {
    this.setSyncBadge();
  }

  getData = () => {
    const res = R.pipe(
      R.map((id: string) =>
        R.merge(
          this.props.files[id],
          R.merge(
            this.props.changedFiles[id] || {},
            this.props.externallyChangedFiles[id] || {},
          ),
        ),
      ),
      R.sortBy(R.prop('mtime')),
      R.reverse,
    )(this.props.filesIds);
    return res;
  };

  openTOC(fileId: string) {
    this.props.loadToc(fileId, this.props.navigator);
  }

  render() {
    return (
      <FlatList
        renderItem={this.renderItem}
        data={this.getData()}
        ItemSeparatorComponent={Separator}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <EmptyList
            itemName={messages.files.vname}
            message={messages.files.description}
          />
        }
        ListHeaderComponent={() => <SectionListHeader title="Notebooks" />}
      />
    );
  }

  renderItem = ({ item, index, section, separators }) => {
    return (
      <OrgFile
        onPress={() => this.openTOC(item.id)}
        onLongPress={() => this.props.showActionsDialog(item)}
        file={item}
      />
    );
  };

  renderSectionHeader = ({ section: { title } }) => {
    return <SectionListHeader title={title} />;
  };

  setSyncBadge() {
    const val = Object.keys(this.props.externallyChangedFiles).length;
    if (val > 0) {
      this.props.navigator.setTabBadge({
        badge: 'sync',
        badgeColor: Colors.warning,
      });
    } else {
      this.props.navigator.setTabBadge({
        badge: null,
      });
    }
  }
}

// ** Redux

const mapStateToProps = R.applySpec({
  files: OrgDataSelectors.getFiles,
  filesIds: OrgDataSelectors.getFilesIds,
  externallyChangedFiles: SyncSelectors.getExternallyChangedFiles,
  changedFiles: SyncSelectors.getChangedFiles,
});

const mapDispatchToProps = {
  loadToc: OrgDataRedux.loadToc,
  showActionsDialog: OrgDataRedux.showFileActionsDialog,
};

// * Exports

export default connect(mapStateToProps, mapDispatchToProps)(OrgFilesScreen);
