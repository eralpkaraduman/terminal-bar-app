import URI from 'urijs';
import SafariView from 'react-native-safari-view';

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

function _launchSpotifyLoginUI() {
    return new Promise((resolve, reject) => {
        SafariView.isAvailable()
            .then(SafariView.show({
                url: 'https://accounts.spotify.com/authorize?client_id=e55f0a2b96cb4d7689be6812106713cf&response_type=token&redirect_uri=terminal-bar://spotify-authorize-callback&state=STATE&scopes=streaming&show_dialog=true',
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

function _dismissSpotifyLoginUI() {
    SafariView.isAvailable()
        .then(SafariView.dismiss())
        .catch(() => console.log('failed to dismiss safari view'));
}

export function processReceivedLink(linkUrl) {
    return dispatch => {
        const uri = URI(linkUrl);
        if (uri.protocol() === 'terminal-bar' && uri.host() === 'spotify-authorize-callback') {
            _processSpotifyAuthCallback(dispatch, uri);
        }
    };
}

function _processSpotifyAuthCallback(dispatch, uri) {
    _dismissSpotifyLoginUI();
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
        });
    }
}
