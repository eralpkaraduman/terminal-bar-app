import * as actionTypes from './actionTypes';

export function fetchPlaylists(spotifyUser = 'self') {
  return {
    type: actionTypes.FETCH_PLAYLISTS,
    spotify_api: {
      path: `/v1/users/${spotifyUser}/playlists`,
      method: 'POST'
    }
  };
}