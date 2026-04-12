import { Track, Artist, Genre } from '../types';
import { API_KEYS } from '../config/apiKeys';

const BASE = 'https://api.soundcloud.com';

// ── helpers ───────────────────────────────────────────────────────────────────

/** Replace SoundCloud artwork suffix to get a high-res image */
function hqArtwork(url: string | null | undefined): string {
  if (!url) return '';
  return url.replace('-large', '-t500x500');
}

function mapTrack(item: any): Track {
  const artist: Artist = {
    id: `sc_${item.user?.id ?? 'unknown'}`,
    name: item.user?.username ?? 'Unknown',
    avatar: hqArtwork(item.user?.avatar_url),
    genre: (item.genre as Genre) ?? 'pop',
    followers: item.user?.followers_count ?? 0,
    verified: false,
    platforms: { soundcloud: String(item.user?.id ?? '') },
  };

  return {
    id: `sc_${item.id}`,
    title: item.title,
    artist,
    cover: hqArtwork(item.artwork_url) || artist.avatar,
    duration: Math.round((item.duration ?? 0) / 1000),
    genre: (item.genre as Genre) ?? 'pop',
    platform: 'soundcloud',
    releaseDate: item.created_at?.split('T')[0] ?? item.created_at?.split(' ')[0] ?? '',
    addedAt: new Date().toISOString(),
    streams: item.playback_count ?? 0,
    liked: false,
  };
}

// ── search ────────────────────────────────────────────────────────────────────

export async function searchSoundCloud(query: string): Promise<Track[]> {
  if (!API_KEYS.soundcloud) return [];
  try {
    const res = await fetch(
      `${BASE}/tracks?q=${encodeURIComponent(query)}&client_id=${API_KEYS.soundcloud}&limit=20`,
    );
    const data = await res.json();
    if (!Array.isArray(data)) return [];
    return data.map(mapTrack);
  } catch (err) {
    console.error('[SoundCloud] searchSoundCloud error:', err);
    return [];
  }
}

// ── trending ──────────────────────────────────────────────────────────────────

export async function getSoundCloudTrending(): Promise<Track[]> {
  if (!API_KEYS.soundcloud) return [];
  try {
    const res = await fetch(
      `${BASE}/tracks?order=hotness&client_id=${API_KEYS.soundcloud}&limit=20`,
    );
    const data = await res.json();
    if (!Array.isArray(data)) return [];
    return data.map(mapTrack);
  } catch (err) {
    console.error('[SoundCloud] getSoundCloudTrending error:', err);
    return [];
  }
}
