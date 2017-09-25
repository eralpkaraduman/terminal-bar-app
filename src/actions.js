import URI from 'urijs';
import SafariView from 'react-native-safari-view';

import config from './config';
import * as actionTypes from './actionTypes';
import * as storage from './storage';

export function initiateSpotifyLogin() {
  return dispatch => {
      dispatch({type: actionTypes.SPOTIFY_LOG_IN_INITIATED});
      _launchSpotifyLoginUI()
        .catch(error => dispatch({type: actionTypes.actionTypes.SPOTIFY_LOG_IN_FAILURE, error: error}));
  };
}

// TODO: move to manager
///////////
function _buildSpotifyLoginUrl() {
return URI('https://accounts.spotify.com/authorize').addQuery({
  client_id: config.SPOTIFY_CLIENT_ID,
  redirect_uri: config.SPOTIFY_REDIRECT_URI,
  response_type: 'token',
  show_dialog: 'true',
  scope: [
    'user-read-playback-state',
    'user-modify-playback-state',
  // 'playlist-read-private',
  // 'playlist-read-collaborative',
    'streaming'
  ].join(' '),
  state: 'STATE'
}).toString();
}
function _launchSpotifyLoginUI() {
return new Promise((resolve, reject) => {
  const loginUrl = _buildSpotifyLoginUrl();
  SafariView.isAvailable()
    .then(SafariView.show({
      url: loginUrl,
      fromBottom: true
    }))
    .then(() => resolve())
    .catch(error => {
      reject('Login UI Couldn\'t be initiated');
    });
});
}
const _dismissSpotifyLoginUI = () => SafariView.isAvailable() // TODO: convert to regular function?
.then(SafariView.dismiss())
.catch(() => console.log('failed to dismiss safari view'));
///////////

// TODO: handle if safariview was dismissed by user, then dispatch failure action
/*
let dismissSubscription = SafariView.addEventListener(
"onDismiss",
() => {
  // logic here
}
);
*/

export function logOut() {
  return dispatch => {
    storage.clearSpotifyCredentials()
      .then(() => dispatch({type: actionTypes.SPOTIFY_LOG_OUT}));
  };
}

export function loadStoredSpotifyCredentials() {
return dispatch => {
  storage.readSpotifyCredentials()
  .then(({access_token, refresh_token, expires_in, date_received}) => dispatch({
    type: actionTypes.SPOTIFY_STORED_CREDENTIALS_LOADED,
    access_token,
    refresh_token,
    expires_in,
    date_received
  }))
  .catch(error => console.error(error));
};
}

function _onSpotifyLoginSuccess(fragmentData) {
  return dispatch => {
    storage.storeSpotifyCredentials({
      access_token: fragmentData.access_token,
      refresh_token: fragmentData.refresh_token,
      expires_in: fragmentData.expires_in,
      date_received: new Date().getTime()
    })
    .then((credentials => dispatch({
      ...credentials,
      type: actionTypes.SPOTIFY_LOG_IN_SUCCESS
    })))
    .catch(error => console.error(error));
  };
}

function _onSpotifyLoginFailure(fragmentData) {
return {
  type: actionTypes.SPOTIFY_LOG_IN_FAILURE,
  error: fragmentData.error
};
}

export function handleSpotifyAuthCallback(uri) {
  const fragmentData = uri.search(uri.fragment()).search(true);
  return dispatch => {
    _dismissSpotifyLoginUI().then(() => {
      if (fragmentData.error) {
        dispatch(_onSpotifyLoginFailure(fragmentData));
      }
      else {
        dispatch(_onSpotifyLoginSuccess(fragmentData));
      }
    });
  };
}


//

export function fetchPlaylists(spotifyUser) {
  return {
    type: actionTypes.FETCH_PLAYLISTS,
    spotify_api: {
      path: `/v1/users/${spotifyUser}/playlists?limit=50`,
      method: 'GET'
    }
  };
}

export function fetchDevices() {
  return {
    type: actionTypes.FETCH_DEVICES,
    spotify_api: {
      path: '/v1/me/player/devices',
      method: 'GET'
    }
  };
}

export function play(contextUri, deviceId) {
  return {
    type: actionTypes.PLAY,
    spotify_api: {
      path: `/v1/me/player/play?device_id=${deviceId}`,
      body: {
        context_uri: contextUri
      },
      method: 'PUT'
    }
  };
}

export function refreshSession(refreshToken) {
  return {
    type: actionTypes.REFRESH_SESSION,
    spotify_api: {
      path: '/api/token',
      method: 'POST',
      body: {
        grant_type: 'authorization_code',
        code: refreshToken,
        redirect_uri: config.SPOTIFY_REDIRECT_URI,
        client_id: config.SPOTIFY_CLIENT_ID,
        client_secret: config.SPOTIFY_CLIENT_SECRET
      }
    }
  };
}
