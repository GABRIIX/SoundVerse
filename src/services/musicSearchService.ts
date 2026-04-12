/**
 * Unified music search service.
 *
 * Aggregates results from YouTube, Spotify and SoundCloud.
 * Falls back to local mock data when no API keys are configured.
 */

import { Track, Artist, Album, Playlist } from '../types';
import { API_KEYS } from '../config/apiKeys';
import { searchYouTube, getYouTubeTrending } from './youtubeService';
import { searchSpotify, getSpotifyNewReleases, getSpotifyFeaturedPlaylists } from './spotifyService';
import { searchSoundCloud, getSoundCloudTrending } from './soundcloudService';
import { TRACKS, ALBUMS, PLAYLISTS } from '../data/mockData';

// ── types ─────────────────────────────────────────────────────────────────────

export type SearchPlatform = 'all' | 'youtube' | 'spotify' | 'soundcloud';

export interface SearchResults {
  tracks: Track[];
  artists: Artist[];
  albums: Album[];
}

// ── helpers ───────────────────────────────────────────────────────────────────

function hasKeys(): boolean {
  return !!(
    API_KEYS.youtube ||
    API_KEYS.spotifyClientId ||
    API_KEYS.soundcloud
  );
}

/** Remove duplicate IDs keeping first occurrence */
function dedup<T extends { id: string }>(arr: T[]): T[] {
  const seen = new Set<string>();
  return arr.filter(item => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

// ── search ────────────────────────────────────────────────────────────────────

/**
 * Search all (or one) platform(s) for `query`.
 * Returns merged, deduplicated results.
 */
export async function searchMusic(
  query: string,
  platform: SearchPlatform = 'all',
): Promise<SearchResults> {
  if (!query.trim()) return { tracks: [], artists: [], albums: [] };

  // No API keys → fall back to local mock filtering
  if (!hasKeys()) {
    const q = query.toLowerCase();
    return {
      tracks: TRACKS.filter(
        t =>
          t.title.toLowerCase().includes(q) ||
          t.artist.name.toLowerCase().includes(q),
      ),
      artists: [],
      albums: [],
    };
  }

  // Build list of platform calls to run in parallel
  const calls: Promise<SearchResults>[] = [];

  if (platform === 'all' || platform === 'youtube') {
    calls.push(
      searchYouTube(query).then(tracks => ({ tracks, artists: [], albums: [] })),
    );
  }

  if (platform === 'all' || platform === 'spotify') {
    calls.push(
      searchSpotify(query).then(({ tracks, artists, albums }) => ({
        tracks,
        artists,
        albums,
      })),
    );
  }

  if (platform === 'all' || platform === 'soundcloud') {
    calls.push(
      searchSoundCloud(query).then(tracks => ({ tracks, artists: [], albums: [] })),
    );
  }

  const settled = await Promise.allSettled(calls);

  const allTracks: Track[] = [];
  const allArtists: Artist[] = [];
  const allAlbums: Album[] = [];

  settled.forEach(r => {
    if (r.status === 'fulfilled') {
      allTracks.push(...r.value.tracks);
      allArtists.push(...r.value.artists);
      allAlbums.push(...r.value.albums);
    }
  });

  return {
    tracks: dedup(allTracks),
    artists: dedup(allArtists),
    albums: dedup(allAlbums),
  };
}

// ── new releases ──────────────────────────────────────────────────────────────

/**
 * Trending tracks from YouTube + SoundCloud.
 * Falls back to mock TRACKS if no keys are set.
 */
export async function getNewReleasesTracks(): Promise<Track[]> {
  if (!hasKeys()) return TRACKS;

  const [ytRes, scRes] = await Promise.allSettled([
    getYouTubeTrending(),
    getSoundCloudTrending(),
  ]);

  const tracks: Track[] = [];
  if (ytRes.status === 'fulfilled') tracks.push(...ytRes.value);
  if (scRes.status === 'fulfilled') tracks.push(...scRes.value);

  return dedup(tracks).length > 0 ? dedup(tracks) : TRACKS;
}

/**
 * New album releases from Spotify.
 * Falls back to mock ALBUMS if Spotify keys are not set.
 */
export async function getNewReleasesAlbums(): Promise<Album[]> {
  if (!API_KEYS.spotifyClientId) return ALBUMS;
  try {
    const albums = await getSpotifyNewReleases();
    return albums.length > 0 ? albums : ALBUMS;
  } catch {
    return ALBUMS;
  }
}

/**
 * Featured playlists from Spotify.
 * Falls back to mock PLAYLISTS if Spotify keys are not set.
 */
export async function getNewReleasesPlaylists(): Promise<Playlist[]> {
  if (!API_KEYS.spotifyClientId) return PLAYLISTS;
  try {
    const playlists = await getSpotifyFeaturedPlaylists();
    return playlists.length > 0 ? playlists : PLAYLISTS;
  } catch {
    return PLAYLISTS;
  }
}
