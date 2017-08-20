import React from 'react';
import { Text, View, Button } from 'react-native';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';

import actions from '../actions';
import selectors from '../selectors';
import playlists from '../playlists';
const {Playlists, DevicesModal} = playlists.components;
import styles from '/styles';

class HomeScreen extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      selectedPlaylist: null,
      selectedDevice: null,
      devicesModalOpen: false
    };
  }

  componentDidMount() {
    this.props.fetchPlaylists('aksakmaksat');
    this.props.fetchDevices();
  }

  componentWillReceiveProps(nextProps) {
    const {devices} = nextProps;
    if (!this.state.selectedDevice && devices && devices.length > 0) {
      this.setState(() => ({selectedDevice: devices[0]}));
    }
  }

  handleLogOutTapped = () => {
    this.props.logOut();
  }

  handlePlaylistSelected = playlistData => {
    this.setState(() => ({
      selectedPlaylist: playlistData
    }));
    
    if (!this.state.selectedDevice) {
      console.log('TODO: show devices screen');
    }
  }

  render() {
    return this.props.isLoggedIn ? (
      <View style={styles.screen}>
        <Text>Current Scene: Home</Text>
        <Text>{`path: ${this.props.location.pathname}`}</Text>
        <Text>{`Logged In: ${this.props.isLoggedIn}`}</Text>
        <Button
          title={'Log out'}
          onPress={this.handleLogOutTapped}
        />
        <Playlists
          onPlaylistSelected={this.handlePlaylistSelected}
        />
        <DevicesModal
          onFetchDevices={this.props.fetchDevices}
          selectedDevice={this.state.selectedDevice}
        />
      </View>
    ) : <Redirect push to="/login"/>; // TODO: remove, redux middleware should handle this
  }
}

function mapStateToProps(state) {
  return {
   isLoggedIn: selectors.session.isLoggedIn(state), // TODO: remove, redux middleware should handle this
   devices: selectors.playlists.selectDevices(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    logOut: () => dispatch(actions.session.logOut()),
    fetchPlaylists: user => dispatch(actions.playlists.fetchPlaylists(user)),
    fetchDevices: () => dispatch(actions.playlists.fetchDevices())
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomeScreen);
