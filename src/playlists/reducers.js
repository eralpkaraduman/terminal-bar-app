import R from 'ramda';
import * as actionTypes from './actionTypes';

const initialState = {
  playlists: [],
  playlistsFetchStatus: undefined,

  devices: [],
  devicesFetchStatus: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case actionTypes.FETCH_PLAYLISTS: return reduceFetchPlaylists(state, action);
    case actionTypes.FETCH_DEVICES: return reduceFetchDevices(state, action);
    default: return state;
  }
}

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
        id: playlist.id,
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
