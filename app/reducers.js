'use_strict';
import * as actions from './actions';
import { combineReducers } from 'redux';

const initialState = {
    isLoggedIn: undefined,
    spotifyToken: undefined
};

function sessionReducer(state = initialState, action) {
    switch (action.type) {
    case actions.SPOTIFY_LOG_IN_SUCCESS:
        return spotifyLogInSucceeded(state, action);
    case actions.SPOTIFY_LOG_IN_FAILURE:
        return spotifyLogInFailure(state, action);
    case actions.CHECK_SESSION:
        return checkSession(state, action);
    default:
        return state;
    }
}

const spotifyLogInSucceeded = (state, action) => {
    const {token} = action;
    return {
        ...state,
        spotifyToken: action.access_token,
        spotifyTokenExpiresIn: action.expires_in,
        spotifyAuthError: null
    };
};

const spotifyLogInFailure = (state, action) => {
    const {token} = action;
    return {
        ...state,
        spotifyToken: null,
        spotifyTokenExpiresIn: null,
        spotifyAuthError: action.error
    };
};

function checkSession(state, action) {
    const isLoggedIn = (state.spotifyToken != null && state.spotifyToken !== undefined);
    return {
        ...state,
        isLoggedIn
    };
}

const reducers = combineReducers({
    session: sessionReducer,
    lastAction: (state = null, action) => action
});

export default reducers;
