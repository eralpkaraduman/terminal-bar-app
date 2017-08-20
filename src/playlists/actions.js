import * as actionTypes from './actionTypes';

export function fetchPlaylists(spotifyUser) {
  return {
    type: actionTypes.FETCH_PLAYLISTS,
    spotify_api: {
      path: `/v1/users/${spotifyUser}/playlists?limit=50`,
      method: 'GET'
    }
  };
}

export function fetchDevices() {
  return {
    type: actionTypes.FETCH_DEVICES,
    spotify_api: {
      path: '/v1/me/player/devices',
      method: 'GET'
    }
  };
}
