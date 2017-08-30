import React from 'react';
import { Text, View, Button } from 'react-native';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';

import * as actions from '../actions';
import * as selectors from '../selectors';

import Playlists from '../components/Playlists';
import DevicesModal from '../components/DevicesModal';

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

  componentDidUpdate(prevProps, prevState) {
    if (
      this.state.selectedPlaylist &&
      this.state.selectedPlaylist !== prevState.selectedPlaylist
    ) {
      if (this.state.selectedDevice) {
        this.props.play(
          this.state.selectedPlaylist.uri,
          this.state.selectedDevice.id
        );
      } else {
        console.log('TODO: else');
      }
    }
  }


  handleLogOutTapped = () => {
    this.props.logOut();
  }

  handlePlaylistSelected = playlistData => {
    if (!this.state.selectedDevice) {
      console.log('TODO: show devices screen');
    }
    else {
      this.setState(() => ({
        selectedPlaylist: playlistData
      }));
    }
  }

  handleDevicesModalChangedDevice = device => {
    // console.log(device);
    this.setState(() => ({
      selectedDevice: device
    }));
  }

  render() {
    return this.props.isLoggedIn ? (
      <View style={styles.screen}>

        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <View style={{flexDirection: 'column', padding: 4}}>
            <Text>Current Scene: Home</Text>
            <Text>{`path: ${this.props.location.pathname}`}</Text>
            <Text>{`Logged In: ${this.props.isLoggedIn}`}</Text>
          </View>

          <View style={{flexDirection: 'column'}}>
            <Button
              title={'Log out'}
              onPress={this.handleLogOutTapped}
            />
          </View>

        </View>

        <Playlists
          onPlaylistSelected={this.handlePlaylistSelected}
        />

        <DevicesModal
          onFetchDevices={this.props.fetchDevices}
          selectedDevice={this.state.selectedDevice}
          onChangedDevice={this.handleDevicesModalChangedDevice}
        />

      </View>
    ) : <Redirect push to="/login"/>; // TODO: remove, redux middleware should handle this
  }
}

function mapStateToProps(state) {
  return {
   isLoggedIn: selectors.isLoggedIn(state), // TODO: remove, redux middleware should handle this
   devices: selectors.selectDevices(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    logOut: () => dispatch(actions.logOut()),
    fetchPlaylists: user => dispatch(actions.fetchPlaylists(user)),
    fetchDevices: () => dispatch(actions.fetchDevices()),
    play: (contextUri, deviceId) => dispatch(
      actions.play(contextUri, deviceId)
    )
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomeScreen);
