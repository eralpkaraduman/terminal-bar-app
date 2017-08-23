import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    paddingTop: 20
  },

  screen: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white'
  },

  modal: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
    paddingTop: 20
  },

  playlists: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#1e1e1e'
  },

  listItem: {
    padding: 12,
    paddingTop: 0,
    flex: 1,
    flexDirection: 'column',
    aspectRatio: 1
  },

  listItemImage: {
    borderRadius: 10,
    flex: 1,
    width: undefined, height: undefined
  },

  deviceListItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 12,
    minHeight: 44
  },

  deviceListItemCheckmark: {
    flex: 1,
    textAlign: 'right'
  },

  listSeperator: {
    flex:1,
    backgroundColor: '#8E8E8E',
    height: StyleSheet.hairlineWidth
  }

});
export default styles;
