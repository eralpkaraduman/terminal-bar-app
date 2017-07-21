import React, { Component } from 'react';
import { Text, View, Button, ListView, Image } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as selectors from '../selectors';
import R from 'ramda';

import styles from '/styles';

class PlaylistList extends Component { // TODO: this component name sucks, but what do you call a list of lists tho?

  constructor(props) {
    super(props);
    const dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => {
        return r1 !== r2;
      }
    });
    this.state = {
      dataSource: dataSource.cloneWithRows(this.props.playlists)
    };

    console.debug(styles);
  }

  componentWillReceiveProps(nextProps) {
    if (!R.eqProps('playlists', nextProps, this.props)) {
      this.setState(prevState => ({
        dataSource: prevState.dataSource.cloneWithRows(nextProps.playlists)
      }));
    }
  }

  renderRow = rowData => (
    <View style={{flex: 1}}>
      {/* <View style={{flex: 1, backgroundColor: 'powderblue'}}>
        <Image
          source={{uri: rowData.image}}
          style={{
            flex: 1,
            width: undefined, height: undefined
          }}
        />
      </View> */}
    </View>
  );

  render() {
    return (
      <View>
        {this.props.isLoading && (
          <Text>Loading Playlists...</Text>
        )}
        {/* <Text>{JSON.stringify(this.props.playlists)}</Text> */}
        <ListView
          enableEmptySections={true}
          contentContainerStyle={styles.list}
          dataSource={this.state.dataSource}
          renderRow={this.renderRow}
        />
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    isLoading: selectors.selectArePlaylistsLoading(state),
    playlists: selectors.selectPlaylists(state)
  };
}

function mapDispatchToProps(dispatch) {
  return {
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PlaylistList);
