import React from 'react';
import { View, Linking } from 'react-native';
import { NativeRouter, Route, Redirect, withRouter } from 'react-router-native';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import URI from 'urijs';

import spotifyApiMiddleware from './spotifyApiMiddleware';
import reducer from './reducer';
import * as actions from './actions';
import * as selectors from './selectors';
import styles from './styles';
import HomeScreen from './screens/HomeScreen';
import LogInScreen from './screens/LogInScreen';

let store = createStore(
  reducer,
  // preloadedState = {}
  applyMiddleware(thunk, spotifyApiMiddleware)
);

// store.subscribe(() => {
//   const state = store.getState();
//   console.debug(state);
//   console.debug(state.lastAction);
// });

// move logic to render func of a Route subclass (AuthRoute ?)
const routeIfLoggedIn = (Component) => () => {
  const state =  store.getState();
  const isLoggedIn = selectors.isLoggedIn(state);
  if (!isLoggedIn) {
    return <Redirect push to="/login"/>;
  }
  else {
    const ComponentWithRouter = withRouter(Component);
    return <ComponentWithRouter/>;
  }
};

export default class TerminalBar extends React.Component {
  componentDidMount() {
    Linking.addEventListener('url', this.handleLinkEvent);
  }

  componentWillUnmount() {
    Linking.removeEventListener('url', this.handleLinkEvent);
  }

  handleLinkEvent(event) {
    const uri = URI(event.url);
    if (uri.protocol() === 'terminal-bar' && uri.host() === 'spotify-authorize-callback') {
      store.dispatch(actions.handleSpotifyAuthCallback(uri));
    }
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
