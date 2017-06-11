import React from 'react';
import { View } from 'react-native';
import { NativeRouter, Route, Redirect, withRouter } from 'react-router-native';
import { Provider } from 'react-redux';
// import createLogger from 'redux-logger';
import thunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import R from 'ramda';

import reducers from './reducers';
import styles from './styles';
import HomeScreen from './screens/HomeScreen';
import LogInScreen from './screens/LogInScreen';

// let loggerMiddleware = createLogger({ // TODO: remove logger
//   level: 'info',
//   colors: {}
// });

const preloadedState = {};

let store = createStore(
  reducers,
  preloadedState,
  applyMiddleware(thunk, /*loggerMiddleware*/)
);

const routeIfLoggedIn = (Component) => () => {
  const state =  store.getState();
  const isLoggedIn = R.path(['session', 'isLoggedIn'], state);
  if (!isLoggedIn) {
    return <Redirect push to="/login"/>;
  }
  Component = withRouter(Component);
  return <Component/>;
};

export default class Root extends React.Component {
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
