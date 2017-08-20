import reducers from './reducers';
import * as selectors from './selectors';
import * as constants from './constants';
import * as actions from './actions';
import Playlists from './components/Playlists';
import DevicesModal from './components/DevicesModal';

export default {
  constants,
  reducers,
  selectors,
  actions,
  components: {Playlists, DevicesModal}
};
