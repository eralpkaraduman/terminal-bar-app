import R from 'ramda';

import {NAME_SPACE} from './constants';

export const isLoggedIn = state => {
  const token = selectToken(state);
  if (R.isNil(token)) {
    return false;
  }
  const now = new Date().getTime();
  const tokenExpiresAt = selectTokenExpiresAt(state);
  const tokenExpired = now >= tokenExpiresAt;
  if (tokenExpired) {
    return false;
  }
  
  return true;
};

export const selectToken = state => state[NAME_SPACE].spotifyToken;
export const selectTokenExpiresAt = state => {
  const expiresIn = state[NAME_SPACE].spotifyTokenExpiresIn;
  const dateReceived = state[NAME_SPACE].spotifyTokenDateReceived;
  return dateReceived + expiresIn * 1000;
}

export const spotifyLoginStatus = state =>
  state[NAME_SPACE].spotifyLoginStatus;

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

