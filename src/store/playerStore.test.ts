import { PLAYLISTS, TRACKS } from '../data/mockData';
import { usePlayerStore } from './playerStore';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const track = TRACKS.find(t => !t.liked);
assert(!!track, 'expected an unliked fixture track');

const playlist = PLAYLISTS.find(p => p.tracks.some(t => t.id === track.id) && p.tracks.length > 1);
assert(!!playlist, 'expected a playlist containing the fixture track');

usePlayerStore.getState().play(track, playlist);
usePlayerStore.getState().toggleLike(track.id);

assert(
  usePlayerStore.getState().currentTrack?.liked === true,
  'toggleLike should mark the current track as liked',
);

assert(
  usePlayerStore.getState().queue.find(t => t.id === track.id)?.liked === true,
  'toggleLike should preserve the liked state in the active queue',
);

usePlayerStore.getState().play(track, playlist);

assert(
  usePlayerStore.getState().currentTrack?.liked === true,
  'play should preserve user like changes when replaying a catalog track',
);
