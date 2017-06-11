'use_strict';
import React from 'react';
import { Text, View } from 'react-native';
import { connect } from 'react-redux';
import * as actions from '../actions';

class HomeScreen extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  componentDidMount() {
    this.props.checkSession();
  }

  render() {
    return (
      <View>
        <Text>Current Scene: Home</Text>
        <Text>{`path: ${this.props.location.pathname}`}</Text>
        <Text>{`Logged In: ${this.props.isLoggedIn}`}</Text>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
   isLoggedIn: state.session.isLoggedIn
  };
}

function mapDispatchToProps(dispatch) {
  return {
    checkSession: () => dispatch({type: actions.CHECK_SESSION})
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomeScreen);
