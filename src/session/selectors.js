import R from 'ramda';

import {NAME_SPACE} from './constants';

export const isLoggedIn = state => {
  const token = selectSpotifyToken(state);
  // TODO: check if token was expired
  return !R.isNil(token);
};

export const selectSpotifyToken = state => state[NAME_SPACE].spotifyToken;

export const spotifyLoginStatus =
  state => state[NAME_SPACE].spotifyLoginStatus;

export const isSpotifyLoginPending = state => {
  return spotifyLoginStatus(state) === 'pending';
};

export const isSpotifyLoginCompleted = state => {
  return spotifyLoginStatus(state) === 'completed';
};

export const spotifyLoginError = state => {
  const completed = isSpotifyLoginCompleted(state);
  const pending = isSpotifyLoginPending(state);
  if (!pending && !completed) {
    return spotifyLoginStatus(state);
  }
  return spotifyLoginStatus(state);
};

