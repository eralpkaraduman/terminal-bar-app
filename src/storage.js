import {AsyncStorage} from 'react-native';
import R from 'ramda';

const spotifyStorage = '@SPOTIFY';
const spotify_access_token_key = `${spotifyStorage}:access_token`;
const spotify_refresh_token_key = `${spotifyStorage}:refresh_token`;
const spotify_expires_in_key = `${spotifyStorage}:expires_in`;
const spotify_date_received_key = `${spotifyStorage}:date_received`;

export function storeSpotifyCredentials(credentials) {
  credentials = {...credentials, expires_in: credentials.expires_in.toString()};
  credentials = {...credentials, date_received: credentials.date_received.toString()};
  const {access_token, refresh_token, expires_in, date_received} = credentials;
  return Promise.all([
    AsyncStorage.setItem(spotify_access_token_key, access_token),
    AsyncStorage.setItem(spotify_refresh_token_key, refresh_token),
    AsyncStorage.setItem(spotify_expires_in_key, expires_in),
    AsyncStorage.setItem(spotify_date_received_key, date_received),
  ])
  .then(() => readSpotifyCredentials());
}

export function readSpotifyCredentials() {
  return Promise.all([
    AsyncStorage.getItem(spotify_access_token_key),
    AsyncStorage.getItem(spotify_refresh_token_key),
    AsyncStorage.getItem(spotify_expires_in_key),
    AsyncStorage.getItem(spotify_date_received_key)
  ])
  .then(R.zipObj([
    'access_token',
    'refresh_token',
    'expires_in',
    'date_received',
  ]))
  .then(credentials => ({...credentials, expires_in: parseInt(credentials.expires_in)}))
  .then(credentials => ({...credentials, date_received: parseInt(credentials.date_received)}));
}

export function clearSpotifyCredentials() {
  return Promise.all([
    AsyncStorage.removeItem(spotify_access_token_key),
    AsyncStorage.removeItem(spotify_refresh_token_key),
    AsyncStorage.removeItem(spotify_expires_in_key),
    AsyncStorage.removeItem(spotify_date_received_key)
  ]);
}
