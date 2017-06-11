import URI from 'urijs';

export const SPOTIFY_LOG_IN_REQUEST = 'SPOTIFY_LOG_IN_REQUEST';
export const SPOTIFY_LOG_IN_SUCCESS = 'SPOTIFY_LOG_IN_SUCCESS';
export const SPOTIFY_LOG_IN_FAILURE = 'SPOTIFY_LOG_IN_FAILURE';
export const SPOTIFY_AUTH_CALLBACK_RECEIVED = 'SPOTIFY_AUTH_CALLBACK_RECEIVED';
export const CHECK_SESSION = 'CHECK_SESSION';

export function requestSpotifyLogIn() {
  return dispatch => {
    return fetch('https://www.reddit.com/r/meirl.json')
      .then(response => response.json())
      .then(json => dispatch(receivedSpotifyLogInResponse(json)))
      .then(() => dispatch({type: CHECK_SESSION}));
  };
}

function processSpotifyAuthCallback(dispatch, uri) {
    const fragmentData = uri.search(uri.fragment()).search(true);
    const {error, access_token, expires_in} = fragmentData;
    if (error) {
        return dispatch({
            type: SPOTIFY_LOG_IN_FAILURE,
            error
        });
    }
    else {
        return dispatch ({
            type: SPOTIFY_LOG_IN_SUCCESS,
            access_token,
            expires_in
        });
    }
}

export function processReceivedLink(linkUrl) {
    return dispatch => {
        const uri = URI(linkUrl);
        if(uri.protocol() == 'terminal-bar' && uri.host() == 'spotify-authorize-callback') {
            processSpotifyAuthCallback(dispatch, uri);
        }
    };
}
