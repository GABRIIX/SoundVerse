import { create } from 'zustand';
import { Track, Playlist } from '../types';

interface PlayerState {
  currentTrack: Track | null;
  currentPlaylist: Playlist | null;
  queue: Track[];
  isPlaying: boolean;
  isShuffled: boolean;
  loopMode: 'none' | 'track' | 'playlist';
  progress: number; // 0–1
  duration: number; // seconds
  isPlayerExpanded: boolean;
  isLimitedToPlaylist: boolean;

  // Actions
  play: (track: Track, playlist?: Playlist) => void;
  pause: () => void;
  resume: () => void;
  togglePlayPause: () => void;
  next: () => void;
  prev: () => void;
  setProgress: (progress: number) => void;
  toggleShuffle: () => void;
  cycleLoop: () => void;
  togglePlayerExpanded: () => void;
  toggleLimitToPlaylist: () => void;
  toggleLike: (trackId: string) => void;
  setQueue: (tracks: Track[]) => void;
  addToQueue: (track: Track) => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
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

  play: (track, playlist) => {
    const { currentPlaylist, queue } = get();
    const source = playlist ?? currentPlaylist;
    const newQueue = source ? source.tracks : [track];
    set({
      currentTrack: track,
      currentPlaylist: playlist ?? get().currentPlaylist,
      queue: newQueue,
      isPlaying: true,
      duration: track.duration,
      progress: 0,
    });
  },

  pause: () => set({ isPlaying: false }),
  resume: () => set({ isPlaying: true }),

  togglePlayPause: () => {
    const { isPlaying } = get();
    set({ isPlaying: !isPlaying });
  },

  next: () => {
    const { currentTrack, queue, isShuffled, loopMode } = get();
    if (!currentTrack || queue.length === 0) return;
    const idx = queue.findIndex(t => t.id === currentTrack.id);
    let nextIdx: number;
    if (loopMode === 'track') {
      nextIdx = idx;
    } else if (isShuffled) {
      nextIdx = Math.floor(Math.random() * queue.length);
    } else {
      nextIdx = (idx + 1) % queue.length;
    }
    const next = queue[nextIdx];
    set({ currentTrack: next, duration: next.duration, progress: 0, isPlaying: true });
  },

  prev: () => {
    const { currentTrack, queue, progress } = get();
    if (!currentTrack || queue.length === 0) return;
    if (progress > 0.05) {
      set({ progress: 0 });
      return;
    }
    const idx = queue.findIndex(t => t.id === currentTrack.id);
    const prevIdx = (idx - 1 + queue.length) % queue.length;
    const prev = queue[prevIdx];
    set({ currentTrack: prev, duration: prev.duration, progress: 0, isPlaying: true });
  },

  setProgress: (progress) => set({ progress }),

  toggleShuffle: () => set(s => ({ isShuffled: !s.isShuffled })),

  cycleLoop: () =>
    set(s => ({
      loopMode:
        s.loopMode === 'none' ? 'playlist' : s.loopMode === 'playlist' ? 'track' : 'none',
    })),

  togglePlayerExpanded: () => set(s => ({ isPlayerExpanded: !s.isPlayerExpanded })),
  toggleLimitToPlaylist: () => set(s => ({ isLimitedToPlaylist: !s.isLimitedToPlaylist })),

  toggleLike: (trackId) => {
    const { currentTrack } = get();
    if (currentTrack?.id === trackId) {
      set({ currentTrack: { ...currentTrack, liked: !currentTrack.liked } });
    }
  },

  setQueue: (tracks) => set({ queue: tracks }),
  addToQueue: (track) => set(s => ({ queue: [...s.queue, track] })),
}));
