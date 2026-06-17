const assert = require('node:assert/strict');
const test = require('node:test');

const { TRACKS, PLAYLISTS } = require('../../.test-build/data/mockData');
const { usePlayerStore } = require('../../.test-build/store/playerStore');

const initialState = {
  currentTrack: null,
  currentPlaylist: null,
  queue: [],
  isPlaying: false,
  isShuffled: false,
  loopMode: 'none',
  progress: 0,
  duration: 0,
  isPlayerExpanded: false,
  isLimitedToPlaylist: false,
};

function resetPlayerStore() {
  usePlayerStore.setState(initialState);
}

function trackOutsidePlaylist(playlist) {
  return TRACKS.find(track => !playlist.tracks.some(item => item.id === track.id));
}

test('play(track) clears stale playlist context and queues only that track', () => {
  resetPlayerStore();

  const playlist = PLAYLISTS[0];
  const singleTrack = trackOutsidePlaylist(playlist);

  usePlayerStore.getState().play(playlist.tracks[0], playlist);
  usePlayerStore.getState().play(singleTrack);

  const state = usePlayerStore.getState();

  assert.equal(state.currentTrack.id, singleTrack.id);
  assert.equal(state.currentPlaylist, null);
  assert.deepEqual(state.queue.map(track => track.id), [singleTrack.id]);
});

test('next stays on a single track after leaving playlist playback', () => {
  resetPlayerStore();

  const playlist = PLAYLISTS[0];
  const singleTrack = trackOutsidePlaylist(playlist);

  usePlayerStore.getState().play(playlist.tracks[0], playlist);
  usePlayerStore.getState().play(singleTrack);
  usePlayerStore.getState().next();

  assert.equal(usePlayerStore.getState().currentTrack.id, singleTrack.id);
});

test('track loop does not crash after leaving playlist playback', () => {
  resetPlayerStore();

  const playlist = PLAYLISTS[0];
  const singleTrack = trackOutsidePlaylist(playlist);

  usePlayerStore.getState().play(playlist.tracks[0], playlist);
  usePlayerStore.getState().cycleLoop();
  usePlayerStore.getState().cycleLoop();
  usePlayerStore.getState().play(singleTrack);

  assert.doesNotThrow(() => usePlayerStore.getState().next());
  assert.equal(usePlayerStore.getState().currentTrack.id, singleTrack.id);
});
