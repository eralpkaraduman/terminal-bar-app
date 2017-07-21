import session from './session';
import playlists from './playlists';
import {combineReducers} from 'redux';

const reducers = combineReducers({
    [session.constants.NAME_SPACE]: session.reducers,
    [playlists.constants.NAME_SPACE]: playlists.reducers,
    lastAction: (state = null, action) => action // for state logging
});

export default reducers;
