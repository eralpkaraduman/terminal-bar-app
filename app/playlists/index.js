import reducers from './reducers';
// import * as selectors from './selectors';
import * as constants from './constants';
import * as actions from './actions';
import PlaylistList from './components/PlaylistList';

export default {
  constants,
  reducers,
  // selectors,
  actions,
  components: {PlaylistList}
};
