import {NAME_SPACE} from './constants';

export const selectPlaylists = state => state[NAME_SPACE].playlists;
export const selectArePlaylistsLoading = state => state[NAME_SPACE].playlistsFetchStatus === 'pending';

export const selectDevicesLoading = state => state[NAME_SPACE].devicesFetchStatus === 'pending';
export const selectDevices = state => state[NAME_SPACE].devices;
