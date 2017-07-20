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
