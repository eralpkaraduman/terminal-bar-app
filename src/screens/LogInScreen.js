import React from 'react';
import { Text, View, Button, /*Linking*/ } from 'react-native';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';

import * as actions from '../actions';
import * as selectors from '../selectors';

class LogInScreen extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  componentDidMount() {
    this.props.loadStoredSpotifyCredentials();
  }

  handleLogInTapped = () => {
    this.props.initiateSpotifyLogin();
  }

  render() {
    return !this.props.isLoggedIn ? (
      <View>
        <Button
          title={'Login with Spotify'}
          onPress={this.handleLogInTapped}
        />
        {this.props.spotifyLoginPending && (
            <Text>Spotify Login Pending...</Text>
        )}
        {this.props.spotifyLoginError && (
            <Text>{`Spotify Login Error ${this.props.spotifyLoginError}`}</Text>
        )}
        {this.props.spotifyLoginCompleted && (
            <Text>Spotify Login Success</Text>
        )}
        <Text>{`isLoggedIn: ${this.props.isLoggedIn}`}</Text>
      </View>
    ) : <Redirect push to="/"/>;
  }
}

function mapStateToProps(state) {
  return {
    isLoggedIn: selectors.isLoggedIn(state),
    spotifyLoginPending: selectors.isSpotifyLoginPending(state),
    spotifyLoginCompleted: selectors.isSpotifyLoginCompleted(state),
    spotifyLoginError: selectors.spotifyLoginError(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    initiateSpotifyLogin: () => dispatch(actions.initiateSpotifyLogin()),
    loadStoredSpotifyCredentials: () => dispatch(actions.loadStoredSpotifyCredentials())
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LogInScreen);
