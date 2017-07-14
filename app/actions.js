import URI from 'urijs';
import SafariView from 'react-native-safari-view';

import config from './config';

export const SPOTIFY_LOG_IN_INITIATED = 'SPOTIFY_LOG_IN_INITIATED';
export const SPOTIFY_LOG_IN_SUCCESS = 'SPOTIFY_LOG_IN_SUCCESS';
export const SPOTIFY_LOG_IN_FAILURE = 'SPOTIFY_LOG_IN_FAILURE';
export const SPOTIFY_AUTH_CALLBACK_RECEIVED = 'SPOTIFY_AUTH_CALLBACK_RECEIVED';
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

function _processSpotifyAuthCallback(uri) {
  return dispatch => {
    const fragmentData = uri.search(uri.fragment()).search(true);
    const {error, access_token, expires_in} = fragmentData;
    if (error) {
      dispatch({
        type: SPOTIFY_LOG_IN_FAILURE,
        error
      });
    }
    else {
      dispatch({
        type: SPOTIFY_LOG_IN_SUCCESS,
        access_token,
        expires_in
      })
    }
    dispatch(checkSession());
  }
}
