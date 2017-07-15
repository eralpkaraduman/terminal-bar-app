// TODO: use this file only for session reducers
'use_strict';
import * as actions from './actions';
import { combineReducers } from 'redux';

const initialState = {
    isLoggedIn: undefined, // TODO: rename to sessionIsActive // TODO: why?
    spotifyToken: undefined,
    spotifyTokenExpiresIn: undefined,
    spotifyLoginStatus: undefined // TODO: remove?
};

function sessionReducer(state = initialState, action) {
    switch (action.type) {
    case actions.SPOTIFY_LOG_IN_INITIATED: return spotifyLogInIntitated(state, action);
    case actions.SPOTIFY_LOG_IN_SUCCESS: return spotifyLogInSucceeded(state, action);
    case actions.SPOTIFY_LOG_IN_FAILURE: return spotifyLogInFailure(state, action);
    case actions.SPOTIFY_STORED_CREDENTIALS_LOADED: return spotifyStoredCredentialsLoaded(state, action);
    case actions.CHECK_SESSION: return checkSession(state, action);
    case actions.SPOTIFY_LOG_OUT: return spotifyLogOut(state, action); // TODO: rename to clearSpotifySession
    default: return state;
    }
}

const spotifyLogInIntitated = (state, action) => {
    return {
        ...state,
        spotifyToken: null,
        spotifyTokenExpiresIn: null,
        spotifyLoginStatus: 'pending'
    };
};

const spotifyLogInSucceeded = (state, action) => {
    const {access_token, expires_in} = action;
    return {
        ...state,
        spotifyToken: access_token,
        spotifyTokenExpiresIn: expires_in,
        spotifyLoginStatus: 'completed'
    };
};

const spotifyLogInFailure = (state, action) => {
    const {error} = action;
    return {
        ...state,
        spotifyToken: null,
        spotifyTokenExpiresIn: null,
        spotifyLoginStatus: error
    };
};

const spotifyStoredCredentialsLoaded = (state, action) => {
  const {access_token, expires_in} = action;
  return {...state,
    spotifyToken: access_token,
    spotifyTokenExpiresIn: expires_in
  }
}

function checkSession(state, action) {
    // TODO: check if spotify session was expired using state.spotifyTokenExpiresIn
    const isLoggedIn = (state.spotifyToken != null && state.spotifyToken !== undefined);
    return {
        ...state,
        isLoggedIn
    };
}

function spotifyLogOut(state, action) {
  return {
    ...state,
    spotifyToken: null,
    spotifyTokenExpiresIn: null,
    spotifyLoginStatus: undefined // TODO: remove?
  }
}

const reducers = combineReducers({ // TODO: move this out
    session: sessionReducer,
    lastAction: (state = null, action) => action // for state logging
});

export default reducers;
