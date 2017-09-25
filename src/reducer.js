import * as actionTypes from './actionTypes';
import R from 'ramda';

const initialState = {
  spotifyLoginStatus: undefined, // TODO: remove?
  spotifyToken: undefined,
  spotifyTokenExpiresIn: undefined,
  spotifyTokenDateReceived: undefined,

  playlists: [],
  playlistsFetchStatus: undefined,
  devices: [],
  devicesFetchStatus: null
};

export default function(state = initialState, action) {
  console.log(state);
  switch (action.type) {
    case actionTypes.SPOTIFY_LOG_IN_INITIATED: return spotifyLogInIntitated(state, action);
    case actionTypes.SPOTIFY_LOG_IN_SUCCESS: return spotifyLogInSucceeded(state, action);
    case actionTypes.SPOTIFY_LOG_IN_FAILURE: return spotifyLogInFailure(state, action);
    case actionTypes.SPOTIFY_STORED_CREDENTIALS_LOADED: return spotifyStoredCredentialsLoaded(state, action);
    case actionTypes.SPOTIFY_LOG_OUT: return spotifyLogOut(state, action); // TODO: rename to clearSpotifySession

    case actionTypes.FETCH_PLAYLISTS: return reduceFetchPlaylists(state, action);
    case actionTypes.FETCH_DEVICES: return reduceFetchDevices(state, action);
    case actionTypes.REFRESH_SESSION: return reduceRefreshSession(state, action);

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
    const {access_token, refresh_token, expires_in, date_received} = action;
    return {
      ...state,
      spotifyLoginStatus: 'completed',
      spotifyToken: access_token,
      refreshToken: refresh_token,
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
  const {access_token, refresh_token, expires_in, date_received} = action;
  return {...state,
    spotifyToken: access_token,
    refreshToken: refresh_token,
    spotifyTokenExpiresIn: expires_in,
    spotifyTokenDateReceived: date_received
  };
};

function spotifyLogOut(state, action) {
  return {
    ...state,
    spotifyToken: null,
    spotifyTokenExpiresIn: null,
    spotifyTokenDateReceived: null,
    spotifyLoginStatus: null
  };
}

//

const reduceFetchPlaylists = (state, action) => {
  const {status, response} = action;
  if (status === 'pending') {
    return {...state,
      playlistsFetchStatus: 'pending'
    };
  }
  else if (status === 'error') {
    return {...state,
      playlistsFetchStatus: 'failed',
    };
  }
  else if (status === 'success') {
    return {...state,
      playlistsFetchStatus: null,
      playlists: response.items.map(playlist => ({
        // id: playlist.id,
        uri: playlist.uri,
        name: playlist.name,
        image: R.path(['images', 0, 'url'], playlist)
      }))
    };
  }
};

const reduceFetchDevices = (state, action) => {
  const {status, response} = action;
  if (status === 'pending') {
    return {...state,
      devicesFetchStatus: status
    };
  }
  else if (status === 'error') {
    return {...state,
      devicesFetchStatus: 'failed',
    };
  }
  else if (status === 'success') {
    return {...state,
      devicesFetchStatus: null,
      devices: response.devices
    };
  }
};

const reduceRefreshSession = (state, action) => {
  const {status, response} = action;
  if (status === 'success') {
    return {...state,
      spotifyTokenExpiresIn: response.expires_in,
      spotifyTokenDateReceived: date_received, // calculate?
      refreshToken: response.refresh_token,
      accessToken: response.access_token
    };
  }
  else {
    return state;
  }
}