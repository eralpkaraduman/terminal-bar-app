'use_strict';
export const SPOTIFY_LOG_IN_REQUEST = 'SPOTIFY_LOG_IN_REQUEST';
export const SPOTIFY_LOG_IN_SUCCESS = 'SPOTIFY_LOG_IN_SUCCESS';
export const SPOTIFY_LOG_IN_FAILURE = 'SPOTIFY_LOG_IN_FAILURE';
export const CHECK_SESSION = 'CHECK_SESSION';

export function requestSpotifyLogIn() {
  return dispatch => {
    return fetch('https://www.reddit.com/r/meirl.json')
      .then(response => response.json())
      .then(json => dispatch(receivedSpotifyLogInResponse(json)))
      .then(() => dispatch({type: CHECK_SESSION}));
  };
}

function receivedSpotifyLogInResponse(json) {
    if (true) {
        return {
            type: SPOTIFY_LOG_IN_SUCCESS,
            token: 'gfjdfg747fg4k7f'
        };
    } else {
        return {
            type: SPOTIFY_LOG_IN_FAILURE,
            error: 'Failed to log in'
        };
    }
}
