import * as actionTypes from './actionTypes';

const initialState = {
  playlists: [],
  playlistsFetchStatus: undefined,
  playlistsFetchError: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case actionTypes.FETCH_PLAYLISTS: return reduceFetchPlaylists(state, action);
    default: return state;
  }
}

const reduceFetchPlaylists = (state, action) => {
  const {status, error, response} = action;
  if (status === 'pending') {
    return {...state,
      playlistsFetchStatus: status
    };
  }
  else if (status === 'error') {
    return {...state,
      playlistsFetchStatus: status,
      playlistsFetchError: error
    };
  }
  else if (status === 'success') {
    return {...state,
      playlistsFetchStatus: status,
      playlistsFetchError: null,
      playlists: response
    };
  }
  else {
    console.debug(action);
  }
};