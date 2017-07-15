'use_strict';
import React from 'react';
import { Text, View, Button } from 'react-native';
import { connect } from 'react-redux';
import * as actions from '../actions';

class HomeScreen extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  componentDidMount() {
    this.props.checkSession();
  }

  handleLogOutTapped = () => {
    this.props.logOut();
  }

  render() {
    return (
      <View>
        <Text>Current Scene: Home</Text>
        <Text>{`path: ${this.props.location.pathname}`}</Text>
        <Text>{`Logged In: ${this.props.isLoggedIn}`}</Text>
        <Button
          title={'Log out'}
          onPress={this.handleLogOutTapped}
        />
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
   isLoggedIn: state.session.isLoggedIn // TODO: isLoggedIn: () => this.selectors.isLoggedIn() // TODO: maybe remove checkSession enirely too
  };
}

function mapDispatchToProps(dispatch) {
  return {
    checkSession: () => dispatch(actions.checkSession()),
    logOut: () => dispatch(actions.logOut())
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomeScreen);
