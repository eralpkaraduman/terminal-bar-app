import React from 'react';
import { Text, View, Button } from 'react-native';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';

import actions from '../actions';
import selectors from '../selectors';
import playlists from '../playlists';
const {PlaylistList} = playlists.components;
import {CURATOR_SPOTIFY_USER_NAME} from '../config'; // TODO: get this from props instead

class HomeScreen extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  componentDidMount() {
    this.props.fetchPlaylists(CURATOR_SPOTIFY_USER_NAME);
  }

  handleLogOutTapped = () => {
    this.props.logOut();
  }

  render() {
    return this.props.isLoggedIn ? (
      <View>
        <Text>Current Scene: Home</Text>
        <Text>{`path: ${this.props.location.pathname}`}</Text>
        <Text>{`Logged In: ${this.props.isLoggedIn}`}</Text>
        <Button
          title={'Log out'}
          onPress={this.handleLogOutTapped}
        />
        <PlaylistList playlists={[]}/>
      </View>
    ) : <Redirect push to="/login"/>;
  }
}

function mapStateToProps(state) {
  return {
   isLoggedIn: selectors.session.isLoggedIn(state)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    logOut: () => dispatch(actions.session.logOut()),
    fetchPlaylists: () => dispatch(actions.playlists.fetchPlaylists())
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomeScreen);
