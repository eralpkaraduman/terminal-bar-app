'use_strict';
import React from 'react';
import { Text, View, Button } from 'react-native';
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
    this.props.dispatch(actions.requestSpotifyLogIn());
    // SafariView.isAvailable()
    //   .then(SafariView.show({
    //     url: 'https://accounts.spotify.com/authorize'
    //   }))
    //   .catch(error => {
    //     // Fallback WebView code for iOS 8 and earlier
    //   });
  }

  // https://accounts.spotify.com/authorize
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
