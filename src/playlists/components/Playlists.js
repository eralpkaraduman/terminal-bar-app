import React, { Component } from 'react';
import { Text, View, Button, ListView, Image, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as selectors from '../selectors';
import R from 'ramda';

import styles from '/styles';

class Playlists extends Component {

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
  }

  componentWillReceiveProps(nextProps) {
    const {playlists} = nextProps;
    if (playlists && !R.eqProps('playlists', nextProps, this.props)) {
      this.setState(prevState => ({
        dataSource: prevState.dataSource.cloneWithRows(playlists)
      }));
    }
  }
  
  // {height: Dimensions.get('screen').width}
  renderRow = rowData => (
    <View style={[
      styles.listItem, {aspectRatio: 1}
    ]}>
      <Image
        source={{uri: rowData.image}}
        style={{
          flex: 1,
          width: undefined, height: undefined
        }}
      />
    </View>
  );

  render() {
    return (
      <View style={styles.playlists}>
        {this.props.isLoading && (
          <Text>Loading Playlists...</Text>
        )}
        <ListView
          enableEmptySections={true}
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
)(Playlists);
