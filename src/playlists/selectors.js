import {NAME_SPACE} from './constants';

export const selectPlaylists = state => state[NAME_SPACE].playlists;
export const selectArePlaylistsLoading = state => state[NAME_SPACE].playlistsFetchStatus === 'pending';
