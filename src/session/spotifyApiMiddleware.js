import R from 'ramda';
import * as selectors from './selectors';
import * as actions from './actions';

export default function(store) {
  return next => action => {
    const state = store.getState();
    if (action.spotify_api) {
      if (selectors.isLoggedIn(state)) {
        const spotifyToken = selectors.selectSpotifyToken(state);
        store.dispatch(fetchSpotifyApi(action, spotifyToken));
      } else {
        store.dispatch(actions.logOut());
      }
    }
    else {
      next(action);
    }
  };
}

const log = message => console.log(`[SPOTIFY_API_MIDDLEWARE] ${message}`);

function fetchSpotifyApi(action, spotifyToken) {
  const {path, method, headers, body} = action.spotify_api;
  action = R.dissoc('spotify_api', action);
  return dispatch => {
    const url = `https://api.spotify.com${path}`;
    log(`Fetching ${method} ${url}`);
    log(`Token ${spotifyToken}`);
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
      else if (response.status === 401) {
        dispatch(actions.logOut());
      }
      else {
        return response.json().then((json => dispatch({
          ...action,
          status: 'error',
          error: {code: response.status, json}
        })));
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
}
