'use_strict';
import React from 'react';
import { Text, View, Button, /*Linking*/ } from 'react-native';
import { connect } from 'react-redux';
import * as actions from '../actions';
import { Redirect } from 'react-router';
import { WebView } from 'react-native';
import styles from '../styles';

class LogInScreen extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  handleLogInTapped = () => {
    this.props.initiateSpotifyLogin();
  }

  componentDidUpdate(prevProps) {
    if (this.props.spotifyLoginCompleted && !prevProps.spotifyLoginCompleted) {
        this.props.checkSession();
    }
  }

  render() {
    if (this.props.isLoggedIn) {
      return <Redirect push to="/"/>;
    }

    return (
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
      </View>
    );
  }
}

function mapStateToProps(state) {
    const splStatus = state.session.spotifyLoginStatus;
    const splCompleted = splStatus === 'completed';
    const splPending = splStatus === 'pending';
    const splError = (splCompleted || splPending) ? null : splStatus;

    console.log({splStatus});
    return {
        isLoggedIn: state.session.isLoggedIn,
        spotifyLoginError: splError,
        spotifyLoginCompleted: splCompleted,
        spotifyLoginPending: splPending,
    };
}

function mapDispatchToProps(dispatch) {
  return {
    checkSession: () => dispatch({type: actions.CHECK_SESSION}),
    initiateSpotifyLogin: () => dispatch(actions.initiateSpotifyLogin())
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LogInScreen);
