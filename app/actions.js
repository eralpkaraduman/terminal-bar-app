import URI from 'urijs';
import SafariView from 'react-native-safari-view';
import {AsyncStorage} from 'react-native';

import config from './config';

export const SPOTIFY_LOG_IN_INITIATED = 'SPOTIFY_LOG_IN_INITIATED';
export const SPOTIFY_LOG_IN_SUCCESS = 'SPOTIFY_LOG_IN_SUCCESS';
export const SPOTIFY_LOG_IN_FAILURE = 'SPOTIFY_LOG_IN_FAILURE';
export const SPOTIFY_AUTH_CALLBACK_RECEIVED = 'SPOTIFY_AUTH_CALLBACK_RECEIVED';
export const SPOTIFY_STORED_CREDENTIALS_LOADED = 'SPOTIFY_STORED_CREDENTIALS_LOADED';
export const SPOTIFY_LOG_OUT = 'SPOTIFY_LOG_OUT'; // TODO: rename to SPOTIFY_CLEAR_SESSION
export const CHECK_SESSION = 'CHECK_SESSION';

export function initiateSpotifyLogin() {
    return dispatch => {
        dispatch({type: SPOTIFY_LOG_IN_INITIATED});
        _launchSpotifyLoginUI()
            .catch(error => dispatch({type: SPOTIFY_LOG_IN_FAILURE, error: error}));
    };
}

function _buildSpotifyLoginURI() {
    return URI('https://accounts.spotify.com/authorize').addQuery({
        client_id: config.SPOTIFY_CLIENT_ID,
        redirect_uri: config.SPOTIFY_REDIRECT_URI,
        response_type: 'token',
        show_dialog: 'true',
        scopes: 'streaming',
        state: 'STATE'
    }).toString();
}

function _launchSpotifyLoginUI() {
    return new Promise((resolve, reject) => {
        SafariView.isAvailable()
            .then(SafariView.show({
                url: _buildSpotifyLoginURI(),
                fromBottom: true
            }))
            .then(() => resolve())
            .catch(error => {
                reject('Login UI Couldn\'t be initiated');
            });
    });
}

// TODO: handle if safariview was dismissed by user, then dispatch failure action
/*
let dismissSubscription = SafariView.addEventListener(
  "onDismiss",
  () => {
    // logic here
  }
);
*/

export const checkSession = () => ({type: CHECK_SESSION});

export function logOut() {
  return dispatch => {
    _clearSpotifyCredentials()
      .then(() => dispatch({type: SPOTIFY_LOG_OUT}))
      .then(() => dispatch(checkSession()))
  }
}

function _dismissSpotifyLoginUI() {
    SafariView.isAvailable()
        .then(SafariView.dismiss())
        .catch(() => console.log('failed to dismiss safari view'));
}

export function processReceivedLink(linkUrl) {
    return dispatch => {
        const uri = URI(linkUrl);
        if (uri.protocol() === 'terminal-bar' && uri.host() === 'spotify-authorize-callback') {
            _dismissSpotifyLoginUI();
            dispatch(_processSpotifyAuthCallback(uri));
        }
    };
}

// todo move to a manager
const spotifyStorage = '@SPOTIFY';
const spotify_access_token_key = `${spotifyStorage}:access_token`;
const spotify_expires_in_key = `${spotifyStorage}:expires_in_key`;
function _storeSpotifyCredentials(access_token, expires_in) {
  return Promise.all([
    AsyncStorage.setItem(spotify_access_token_key, access_token),
    AsyncStorage.setItem(spotify_expires_in_key, expires_in),
  ]);
}
function _readSpotifyCredentials() {
  return Promise.all([
    AsyncStorage.getItem(spotify_access_token_key),
    AsyncStorage.getItem(spotify_expires_in_key)
  ]).then(credentials => ({
    access_token: credentials[0],
    expires_in: credentials[1]
  }));
}
function _clearSpotifyCredentials() {
  return Promise.all([
    AsyncStorage.removeItem(spotify_access_token_key),
    AsyncStorage.removeItem(spotify_expires_in_key)
  ]);
}

export function loadStoredSpotifyCredentials() {
  return dispatch => {
    _readSpotifyCredentials()
      .then((access_token, expires_in) => dispatch({
        type: SPOTIFY_STORED_CREDENTIALS_LOADED,
        access_token,
        expires_in
      }))
      .then(() => dispatch(checkSession()))
      .catch(error => console.error(error));
  }
}

function _processSpotifyAuthCallback(uri) {
  return dispatch => {
    const fragmentData = uri.search(uri.fragment()).search(true);
    const {error, access_token, expires_in} = fragmentData;
    if (error) {
      dispatch({
        type: SPOTIFY_LOG_IN_FAILURE,
        error
      });
      dispatch(checkSession());
    }
    else {
      _storeSpotifyCredentials(access_token, expires_in)
        .then(() => dispatch({
          type: SPOTIFY_LOG_IN_SUCCESS,
          access_token,
          expires_in
        }))
        .then(() => dispatch(checkSession()))
    }
  }
}
