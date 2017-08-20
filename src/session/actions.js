import URI from 'urijs';
import SafariView from 'react-native-safari-view';
import {AsyncStorage} from 'react-native';
import R from 'ramda';

import config from '../config';
import * as actionTypes from './actionTypes';

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
    _clearSpotifyCredentials()
      .then(() => dispatch({type: actionTypes.SPOTIFY_LOG_OUT}));
  };
}

///////////////
// TODO: move to a manager
const spotifyStorage = '@SPOTIFY';
const spotify_access_token_key = `${spotifyStorage}:access_token`;
const spotify_expires_in_key = `${spotifyStorage}:expires_in`;
const spotify_date_received_key = `${spotifyStorage}:date_received`;
function _storeSpotifyCredentials(credentials) {
  credentials = {...credentials, expires_in: credentials.expires_in.toString()};
  credentials = {...credentials, date_received: credentials.date_received.toString()};
  const {access_token, expires_in, date_received} = credentials;
  return Promise.all([
    AsyncStorage.setItem(spotify_access_token_key, access_token),
    AsyncStorage.setItem(spotify_expires_in_key, expires_in),
    AsyncStorage.setItem(spotify_date_received_key, date_received),
  ])
  .then(() => _readSpotifyCredentials());
}
function _readSpotifyCredentials() {
  return Promise.all([
    AsyncStorage.getItem(spotify_access_token_key),
    AsyncStorage.getItem(spotify_expires_in_key),
    AsyncStorage.getItem(spotify_date_received_key)
  ])
  .then(R.zipObj([
    'access_token',
    'expires_in',
    'date_received'
  ]))
  .then(credentials => ({...credentials, expires_in: parseInt(credentials.expires_in)}))
  .then(credentials => ({...credentials, date_received: parseInt(credentials.date_received)}));
}
function _clearSpotifyCredentials() {
  return Promise.all([
    AsyncStorage.removeItem(spotify_access_token_key),
    AsyncStorage.removeItem(spotify_expires_in_key),
    AsyncStorage.removeItem(spotify_date_received_key)
  ]);
}
///////////////

export function loadStoredSpotifyCredentials() {
  return dispatch => {
    _readSpotifyCredentials()
    .then(({access_token, expires_in, date_received}) => dispatch({
      type: actionTypes.SPOTIFY_STORED_CREDENTIALS_LOADED,
      access_token,
      expires_in,
      date_received
    }))
    .catch(error => console.error(error));
  };
}

function _onSpotifyLoginSuccess(fragmentData) {
  return dispatch => {
    _storeSpotifyCredentials({
      access_token: fragmentData.access_token,
      expires_in: fragmentData.expires_in,
      date_received: new Date().getTime()
    })
    .then((credentials => dispatch({
      ...credentials,
      type: actionTypes.SPOTIFY_LOG_IN_SUCCESS
    })))
    .catch(error => console.error(error));
  }
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
  }
}
