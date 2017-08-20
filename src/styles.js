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
  }
});
export default styles;
