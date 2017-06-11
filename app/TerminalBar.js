import React from 'react';
import { View, Linking } from 'react-native';
import { NativeRouter, Route, Redirect, withRouter } from 'react-router-native';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Provider, connect } from 'react-redux';
import R from 'ramda';

import reducers from './reducers';
import * as actions from './actions';
import styles from './styles';
import HomeScreen from './screens/HomeScreen';
import LogInScreen from './screens/LogInScreen';

const preloadedState = {};

let store = createStore(
  reducers,
  preloadedState,
  applyMiddleware(thunk)
);

let unsubscribe = store.subscribe(() => {
  const state = store.getState();
  //console.debug(state);
  console.debug(state.lastAction);
});

const routeIfLoggedIn = (Component) => () => {
  const state =  store.getState();
  const isLoggedIn = R.path(['session', 'isLoggedIn'], state);
  if (!isLoggedIn) {
    return <Redirect push to="/login"/>;
  }
  Component = withRouter(Component);
  return <Component/>;
};

export default class TerminalBar extends React.Component {
  componentDidMount() {
    Linking.addEventListener('url', this.handleLinkEvent);
  }

  componentWillUnmount() {
    Linking.removeEventListener('url', this.handleLinkEvent);
  }

  handleLinkEvent(event) {
    store.dispatch(actions.processReceivedLink(event.url));
  }

  render() {
    return (
      <Provider store={store}>
        <NativeRouter>
          <View style={styles.container}>
            <Route exact path="/" render={routeIfLoggedIn(HomeScreen)}/>
            <Route exact path="/login" component={LogInScreen}/>
          </View>
        </NativeRouter>
      </Provider>
    );
  }
}
