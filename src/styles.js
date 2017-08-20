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
    flexDirection: 'column'
  },

  listItem: {
    flex: 1,
    flexDirection: 'column',
    aspectRatio: 1,
    backgroundColor: 'black'
  }
});
export default styles;
