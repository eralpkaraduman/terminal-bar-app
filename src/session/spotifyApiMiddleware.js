import R from 'ramda';
import * as selectors from './selectors';
import * as actions from './actions';

export default function(store) {
  return next => action => {
    const state = store.getState();
    if (action.spotify_api) {
      if (selectors.isLoggedIn(state)) {
        const spotifyToken = selectors.selectToken(state);
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

const tag = '[SPOTIFY_API_MIDDLEWARE]';
const log = message => console.log(`${tag} ${message}`);

function fetchSpotifyApi(action, spotifyToken) {
  const {path, method, headers, body} = action.spotify_api;
  action = R.dissoc('spotify_api', action);
  return dispatch => {
    const url = `https://api.spotify.com${path}`;
    log(`Fetching ${method} ${url}`);
    // log(`Token ${spotifyToken}`);
    dispatch({
      ...action,
      status: 'pending'
    });

    let jsonBody = null;
    if (body) {
      try {
        jsonBody = JSON.stringify(body);
      }
      catch (e) {
        throw `${tag} Couldnt encode json: ${e}`;
      }
    }

    return fetch(url, {
      method,
      body: jsonBody,
      headers: {...headers,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${spotifyToken}`
      },
    })
    .then(response => {
      log(`Response ${response.status}: ${method} ${url}`);
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
    .catch(error => {
      log(`Error ${method} ${url}: ${error}`);
      dispatch({
        ...action,
        status: 'error',
        error
      });
    });
  };
}
