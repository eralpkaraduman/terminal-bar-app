import React from 'react';
import { View, Linking } from 'react-native';
import { NativeRouter, Route, Redirect, withRouter } from 'react-router-native';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Provider, connect } from 'react-redux';
import R from 'ramda';
import URI from 'urijs';

// CURATOR_SPOTIFY_USER_NAME: 'aksakmaksat',
// SPOTIFY_API_ROOT: 'https://api.spotify.com'

import reducers from './reducers';
import actions from './actions';
import selectors from './selectors';
import styles from './styles';
import HomeScreen from './screens/HomeScreen';
import LogInScreen from './screens/LogInScreen';

const preloadedState = {};

// TODO: move to a seperate file
const log = message => console.log(`[SPOTIFY_API_MIDDLEWARE] ${message}`);
const fetchSpotifyApi = (action, spotifyToken) => {
  const {path, method, headers, body} = action.spotify_api;
  action = R.dissoc('spotify_api', action);
  return dispatch => {
    const url = `https://api.spotify.com${path}`;
    log(`Fetching ${url}`);
    dispatch({
      ...action,
      status: 'pending'
    });
    return fetch(url, {
      method,
      body,
      headers: {...headers,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${spotifyToken}`
      },
    })
    .then(response => {
      if (response.ok) {
        return response;
      }
      else {
        return response.json().then((json => {
          throw {
            statusCode: response.status,
            body: json
          };
        }));
      }
    })
    .then((response) => response.json())
    .then((responseJson) => dispatch({
      ...action,
      status: 'success',
      response: responseJson
    }))
    .catch(error => dispatch({
      ...action,
      status: 'error',
      error
    }));
  };
};
const spotifyApiMiddleware = store => next => action => {
  const state = store.getState();
  if (action.spotify_api) {
    if (selectors.session.isLoggedIn(state)) {
      const spotifyToken = selectors.session.selectSpotifyToken(state);
      store.dispatch(fetchSpotifyApi(action, spotifyToken));
    } else {
      // TODO: log out & navigate to login screen
      console.log('TODO: log out & navigate to login screen');
    }
  }
  else {
    next(action);
  }
};

let store = createStore(
  reducers,
  preloadedState,
  applyMiddleware(thunk, spotifyApiMiddleware)
);

store.subscribe(() => {
  const state = store.getState();
  //console.debug(state);
  console.debug(state.lastAction);
});

// move logic to render func of a Route subclass (AuthRoute ?)
const routeIfLoggedIn = (Component) => () => {
  const state =  store.getState();
  const isLoggedIn = selectors.session.isLoggedIn(state);
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
      store.dispatch(actions.session.handleSpotifyAuthCallback(uri));
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
