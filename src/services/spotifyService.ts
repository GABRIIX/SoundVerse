import { Track, Artist, Album, Genre, Playlist } from '../types';
import { API_KEYS } from '../config/apiKeys';

const TOKEN_URL = 'https://accounts.spotify.com/api/token';
const BASE = 'https://api.spotify.com/v1';

// ── token cache ───────────────────────────────────────────────────────────────

let _token: string | null = null;
let _tokenExpiry = 0;

async function getToken(): Promise<string | null> {
  if (!API_KEYS.spotifyClientId || !API_KEYS.spotifyClientSecret) return null;
  if (_token && Date.now() < _tokenExpiry) return _token;

  try {
    const creds = btoa(`${API_KEYS.spotifyClientId}:${API_KEYS.spotifyClientSecret}`);
    const res = await fetch(TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${creds}`,
      },
      body: 'grant_type=client_credentials',
    });
    const data = await res.json();
    if (!data.access_token) {
      console.error('[Spotify] token response:', data);
      return null;
    }
    _token = data.access_token;
    _tokenExpiry = Date.now() + (data.expires_in - 60) * 1000;
    return _token;
  } catch (err) {
    console.error('[Spotify] getToken error:', err);
    return null;
  }
}

async function authFetch(url: string): Promise<any> {
  const token = await getToken();
  if (!token) return null;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  return res.json();
}

// ── mappers ───────────────────────────────────────────────────────────────────

function spArtist(item: any): Artist {
  return {
    id: `sp_${item.id}`,
    name: item.name,
    avatar: item.images?.[0]?.url ?? '',
    genre: (item.genres?.[0] as Genre) ?? 'pop',
    followers: item.followers?.total ?? 0,
    verified: (item.popularity ?? 0) >= 70,
    platforms: { spotify: item.id },
  };
}

function spTrack(item: any): Track {
  const images: { url: string }[] = item.album?.images ?? [];
  return {
    id: `sp_${item.id}`,
    title: item.name,
    artist: {
      id: `sp_${item.artists?.[0]?.id ?? 'unknown'}`,
      name: item.artists?.[0]?.name ?? 'Unknown',
      avatar: '',
      genre: 'pop',
      followers: 0,
      verified: false,
      platforms: { spotify: item.artists?.[0]?.id },
    },
    cover: images[0]?.url ?? images[1]?.url ?? '',
    duration: Math.round((item.duration_ms ?? 0) / 1000),
    genre: 'pop',
    platform: 'spotify',
    releaseDate: item.album?.release_date ?? '',
    addedAt: new Date().toISOString(),
    streams: (item.popularity ?? 0) * 10_000,
    liked: false,
  };
}

function spAlbum(item: any): Album {
  const images: { url: string }[] = item.images ?? [];
  return {
    id: `sp_${item.id}`,
    title: item.name,
    artist: {
      id: `sp_${item.artists?.[0]?.id ?? 'unknown'}`,
      name: item.artists?.[0]?.name ?? 'Unknown',
      avatar: '',
      genre: 'pop',
      followers: 0,
      verified: false,
      platforms: { spotify: item.artists?.[0]?.id },
    },
    cover: images[0]?.url ?? '',
    releaseDate: item.release_date ?? '',
    addedAt: new Date().toISOString(),
    tracks: [],
    platform: 'spotify',
    genre: 'pop',
  };
}

// ── search ────────────────────────────────────────────────────────────────────

export async function searchSpotify(
  query: string,
): Promise<{ tracks: Track[]; artists: Artist[]; albums: Album[] }> {
  const empty = { tracks: [], artists: [], albums: [] };
  if (!API_KEYS.spotifyClientId) return empty;

  try {
    const data = await authFetch(
      `${BASE}/search?q=${encodeURIComponent(query)}&type=track,artist,album&limit=20`,
    );
    if (!data) return empty;

    return {
      tracks: (data.tracks?.items ?? []).map(spTrack),
      artists: (data.artists?.items ?? []).map(spArtist),
      albums: (data.albums?.items ?? []).map(spAlbum),
    };
  } catch (err) {
    console.error('[Spotify] searchSpotify error:', err);
    return empty;
  }
}

// ── new releases ──────────────────────────────────────────────────────────────

export async function getSpotifyNewReleases(): Promise<Album[]> {
  if (!API_KEYS.spotifyClientId) return [];
  try {
    const data = await authFetch(`${BASE}/browse/new-releases?limit=20&country=IT`);
    return (data?.albums?.items ?? []).map(spAlbum);
  } catch (err) {
    console.error('[Spotify] getSpotifyNewReleases error:', err);
    return [];
  }
}

// ── featured playlists ────────────────────────────────────────────────────────

export async function getSpotifyFeaturedPlaylists(): Promise<Playlist[]> {
  if (!API_KEYS.spotifyClientId) return [];
  try {
    const data = await authFetch(`${BASE}/browse/featured-playlists?limit=20&country=IT`);
    return (data?.playlists?.items ?? []).map(
      (item: any): Playlist => ({
        id: `sp_${item.id}`,
        name: item.name,
        cover: item.images?.[0]?.url ?? '',
        tracks: [],
        isPrivate: false,
        isSystem: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ownerId: 'spotify',
      }),
    );
  } catch (err) {
    console.error('[Spotify] getSpotifyFeaturedPlaylists error:', err);
    return [];
  }
}

// ── artist top tracks ─────────────────────────────────────────────────────────

export async function getSpotifyArtistTopTracks(artistId: string): Promise<Track[]> {
  if (!API_KEYS.spotifyClientId) return [];
  // strip prefix added by spArtist mapper
  const rawId = artistId.replace(/^sp_/, '');
  try {
    const data = await authFetch(`${BASE}/artists/${rawId}/top-tracks?market=IT`);
    return (data?.tracks ?? []).map(spTrack);
  } catch (err) {
    console.error('[Spotify] getSpotifyArtistTopTracks error:', err);
    return [];
  }
}
