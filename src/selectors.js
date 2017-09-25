import R from 'ramda';

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

export const selectToken = state => state.spotifyToken;
export const selectRefreshToken = state => state.refreshToken;
export const selectTokenExpiresAt = state => {
  const expiresIn = state.spotifyTokenExpiresIn;
  const dateReceived = state.spotifyTokenDateReceived;
  return dateReceived + (expiresIn * 1000);
};

export const spotifyLoginStatus = state =>
  state.spotifyLoginStatus;

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

//

export const selectPlaylists = state => state.playlists;
export const selectArePlaylistsLoading = state => state.playlistsFetchStatus === 'pending';

export const selectDevicesLoading = state => state.devicesFetchStatus === 'pending';
export const selectDevices = state => state.devices;
