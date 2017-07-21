// TODO: use this file only for session reducers, i think i did?
import * as actionTypes from './actionTypes';

const initialState = {
  spotifyLoginStatus: undefined, // TODO: remove?
  spotifyToken: undefined,
  spotifyTokenExpiresIn: undefined,
  spotifyTokenDateReceived: undefined
};

export default function(state = initialState, action) {
    switch (action.type) {
    case actionTypes.SPOTIFY_LOG_IN_INITIATED: return spotifyLogInIntitated(state, action);
    case actionTypes.SPOTIFY_LOG_IN_SUCCESS: return spotifyLogInSucceeded(state, action);
    case actionTypes.SPOTIFY_LOG_IN_FAILURE: return spotifyLogInFailure(state, action);
    case actionTypes.SPOTIFY_STORED_CREDENTIALS_LOADED: return spotifyStoredCredentialsLoaded(state, action);
    case actionTypes.SPOTIFY_LOG_OUT: return spotifyLogOut(state, action); // TODO: rename to clearSpotifySession
    default: return state;
    }
}

const spotifyLogInIntitated = (state, action) => {
  return {
    ...state,
    spotifyLoginStatus: 'pending'
  };
};

const spotifyLogInSucceeded = (state, action) => {
    const {access_token, expires_in, date_received} = action;
    return {
        ...state,
        spotifyLoginStatus: 'completed',
        spotifyToken: access_token,
        spotifyTokenExpiresIn: expires_in,
        spotifyTokenDateReceived: date_received
    };
};

const spotifyLogInFailure = (state, action) => {
    const {error} = action;
    return {
        ...state,
        spotifyLoginStatus: error
    };
};

const spotifyStoredCredentialsLoaded = (state, action) => {
  const {access_token, expires_in, date_received} = action;
  return {...state,
    spotifyToken: access_token,
    spotifyTokenExpiresIn: expires_in,
    spotifyTokenDateReceived: date_received
  }
}

function spotifyLogOut(state, action) {
  return {
    ...state,
    spotifyToken: null,
    spotifyTokenExpiresIn: null,
    spotifyTokenDateReceived: null,
    spotifyLoginStatus: null
  }
}
