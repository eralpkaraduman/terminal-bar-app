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
        spotifyToken: token
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
    session: sessionReducer
});
export default reducers;
