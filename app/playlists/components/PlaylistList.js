import React, { Component } from 'react';
import { Text, View, Button } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as selectors from '../selectors';

class PlaylistList extends Component { // TODO: this component name sucks, but what do you call a list of lists tho?
  render() {
    return (
      <View>
        {this.props.isLoading && (
          <Text>Loading Playlists...</Text>
        )}
        <Text>{JSON.stringify(this.props.playlists)}</Text>
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
