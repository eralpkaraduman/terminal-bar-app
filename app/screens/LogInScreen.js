'use_strict';
import React from 'react';
import { Text, View, Button, Linking } from 'react-native';
import { connect } from 'react-redux';
import * as actions from '../actions';
import { Redirect } from 'react-router';
import { WebView } from 'react-native';
import styles from '../styles';
import SafariView from 'react-native-safari-view';

class LogInScreen extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  handleLogInTapped = () => {

    // this.props.dispatch(actions.requestSpotifyLogIn());
    SafariView.isAvailable()
      .then(SafariView.show({
        url: 'https://accounts.spotify.com/authorize?client_id=e55f0a2b96cb4d7689be6812106713cf&response_type=token&redirect_uri=terminal-bar://spotify-authorize-callback&state=STATE&scopes=streaming&show_dialog=true'
      }))
      .catch(error => {
        // Fallback WebView code for iOS 8 and earlier
      });
  }

  componentDidMount() {
    Linking.addEventListener('url', this._handleOpenURL);
  }

  componentWillUnmount() {
    Linking.removeEventListener('url', this._handleOpenURL);
  }

  _handleOpenURL(event) {
    console.log(event.url);
    if (true) {
      SafariView.dismiss();
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
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    isLoggedIn:state.session.isLoggedIn
  };
}

export default connect(mapStateToProps)(LogInScreen);
