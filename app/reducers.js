import session from './session';
import {combineReducers} from 'redux';

const reducers = combineReducers({
    [session.constants.NAME_SPACE]: session.reducers,
    lastAction: (state = null, action) => action // for state logging
});

export default reducers;
