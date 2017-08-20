import React from 'react';
import PropTypes from 'prop-types';
import { Text, View, Button } from 'react-native';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';

import actions from '../actions';
import selectors from '../selectors';
import playlists from '../playlists';
const {Playlists} = playlists.components;
import styles from '/styles';

class HomeScreen extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  componentDidMount() {
    this.props.fetchPlaylists('aksakmaksat');
  }

  handleLogOutTapped = () => {
    this.props.logOut();
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
        <Playlists/>
      </View>
    ) : <Redirect push to="/login"/>; // TODO: remove, redux middleware should handle this
  }
}

function mapStateToProps(state) {
  return {
   isLoggedIn: selectors.session.isLoggedIn(state) // TODO: remove, redux middleware should handle this
  };
}

function mapDispatchToProps(dispatch) {
  return {
    logOut: () => dispatch(actions.session.logOut()),
    fetchPlaylists: user => dispatch(actions.playlists.fetchPlaylists(user))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomeScreen);
