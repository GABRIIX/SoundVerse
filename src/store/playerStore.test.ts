import { Artist, Playlist, Track } from '../types';
import { usePlayerStore } from './playerStore';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const artist: Artist = {
  id: 'artist',
  name: 'Fixture Artist',
  avatar: 'https://example.com/avatar.jpg',
  genre: 'rap',
  followers: 1,
  verified: true,
  platforms: { spotify: 'fixture' },
};

const track: Track = {
  id: 'track',
  title: 'Fixture Track',
  artist,
  cover: 'https://example.com/cover.jpg',
  duration: 180,
  genre: 'rap',
  platform: 'spotify',
  releaseDate: '2026-01-01',
  addedAt: '2026-01-01',
  liked: false,
};

const nextTrack: Track = {
  ...track,
  id: 'next-track',
  title: 'Next Track',
};

const playlist: Playlist = {
  id: 'playlist',
  name: 'Fixture Playlist',
  cover: 'https://example.com/playlist.jpg',
  tracks: [track, nextTrack],
  isPrivate: false,
  isSystem: false,
  createdAt: '2026-01-01',
  updatedAt: '2026-01-01',
  ownerId: 'me',
};

function resetStore() {
  usePlayerStore.setState({
    currentTrack: null,
    currentPlaylist: null,
    queue: [],
    likeOverrides: {},
    isPlaying: false,
    isShuffled: false,
    loopMode: 'none',
    progress: 0,
    duration: 0,
    isPlayerExpanded: false,
    isLimitedToPlaylist: false,
  });
}

resetStore();
usePlayerStore.getState().play(track, playlist);
usePlayerStore.getState().toggleLike(track.id);

assert(usePlayerStore.getState().currentTrack?.liked === true, 'toggleLike should mark currentTrack liked');
assert(
  usePlayerStore.getState().queue.find(t => t.id === track.id)?.liked === true,
  'toggleLike should mark the active queue entry liked',
);
assert(
  usePlayerStore.getState().currentPlaylist?.tracks.find(t => t.id === track.id)?.liked === true,
  'toggleLike should mark the currentPlaylist entry liked',
);

usePlayerStore.getState().play(track, playlist);
assert(
  usePlayerStore.getState().currentTrack?.liked === true,
  'play(track, playlist) should preserve user like overrides',
);

resetStore();
usePlayerStore.getState().play(track);
usePlayerStore.getState().toggleLike(track.id);
usePlayerStore.getState().play(track);
assert(
  usePlayerStore.getState().currentTrack?.liked === true,
  'play(track) should preserve user like overrides',
);

usePlayerStore.getState().setQueue([track]);
assert(
  usePlayerStore.getState().queue[0]?.liked === true,
  'setQueue should preserve user like overrides',
);

usePlayerStore.getState().setQueue([]);
usePlayerStore.getState().addToQueue(track);
assert(
  usePlayerStore.getState().queue[0]?.liked === true,
  'addToQueue should preserve user like overrides',
);

console.log('player_store_like_regression_passed');
