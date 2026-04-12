import { Track, Artist, Genre } from '../types';
import { API_KEYS } from '../config/apiKeys';

const BASE = 'https://www.googleapis.com/youtube/v3';

// ── helpers ─────────────────────────────────────────────────────────────────

/** Parse ISO 8601 duration (e.g. "PT3M45S") → seconds */
function parseDuration(iso: string): number {
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!m) return 0;
  return (parseInt(m[1] || '0') * 3600)
    + (parseInt(m[2] || '0') * 60)
    + parseInt(m[3] || '0');
}

function makeArtist(channelId: string, channelTitle: string, avatar = ''): Artist {
  return {
    id: `yt_${channelId}`,
    name: channelTitle,
    avatar,
    genre: 'pop' as Genre,
    followers: 0,
    verified: false,
    platforms: { youtube: channelId },
  };
}

function pickCover(thumbnails: Record<string, { url: string }> = {}): string {
  return (
    thumbnails.maxres?.url ||
    thumbnails.high?.url ||
    thumbnails.medium?.url ||
    thumbnails.default?.url ||
    ''
  );
}

// ── search ───────────────────────────────────────────────────────────────────

/**
 * Search YouTube for music videos matching `query`.
 * Makes 2 API calls: search + videos (for duration).
 */
export async function searchYouTube(query: string): Promise<Track[]> {
  if (!API_KEYS.youtube) return [];
  try {
    // 1 – search
    const searchRes = await fetch(
      `${BASE}/search?part=snippet&type=video&videoCategoryId=10` +
      `&q=${encodeURIComponent(query)}&maxResults=20&key=${API_KEYS.youtube}`,
    );
    const searchData = await searchRes.json();
    if (!searchData.items?.length) return [];

    // 2 – video details (duration + viewCount)
    const ids = searchData.items.map((i: any) => i.id.videoId).filter(Boolean).join(',');
    const detailRes = await fetch(
      `${BASE}/videos?part=contentDetails,statistics&id=${ids}&key=${API_KEYS.youtube}`,
    );
    const detailData = await detailRes.json();

    const byId: Record<string, any> = {};
    (detailData.items || []).forEach((v: any) => { byId[v.id] = v; });

    return searchData.items
      .filter((item: any) => item.id?.videoId)
      .map((item: any): Track => {
        const videoId: string = item.id.videoId;
        const sn = item.snippet;
        const det = byId[videoId];

        return {
          id: `yt_${videoId}`,
          title: sn.title,
          artist: makeArtist(sn.channelId, sn.channelTitle, sn.thumbnails?.default?.url),
          cover: pickCover(sn.thumbnails),
          duration: det ? parseDuration(det.contentDetails?.duration || 'PT0S') : 0,
          genre: 'pop',
          platform: 'youtube',
          releaseDate: sn.publishedAt?.split('T')[0] ?? '',
          addedAt: new Date().toISOString(),
          streams: parseInt(det?.statistics?.viewCount ?? '0', 10),
          liked: false,
          videoUrl: `https://www.youtube.com/watch?v=${videoId}`,
        };
      });
  } catch (err) {
    console.error('[YouTube] searchYouTube error:', err);
    return [];
  }
}

// ── trending ──────────────────────────────────────────────────────────────────

/**
 * Fetch YouTube trending music chart for Italy.
 * Uses `chart=mostPopular&videoCategoryId=10&regionCode=IT`.
 */
export async function getYouTubeTrending(): Promise<Track[]> {
  if (!API_KEYS.youtube) return [];
  try {
    const res = await fetch(
      `${BASE}/videos?part=snippet,contentDetails,statistics` +
      `&chart=mostPopular&videoCategoryId=10&regionCode=IT&maxResults=20&key=${API_KEYS.youtube}`,
    );
    const data = await res.json();
    if (!data.items?.length) return [];

    return data.items.map((item: any): Track => ({
      id: `yt_${item.id}`,
      title: item.snippet.title,
      artist: makeArtist(item.snippet.channelId, item.snippet.channelTitle),
      cover: pickCover(item.snippet.thumbnails),
      duration: parseDuration(item.contentDetails?.duration || 'PT0S'),
      genre: 'pop',
      platform: 'youtube',
      releaseDate: item.snippet.publishedAt?.split('T')[0] ?? '',
      addedAt: new Date().toISOString(),
      streams: parseInt(item.statistics?.viewCount ?? '0', 10),
      liked: false,
      videoUrl: `https://www.youtube.com/watch?v=${item.id}`,
    }));
  } catch (err) {
    console.error('[YouTube] getYouTubeTrending error:', err);
    return [];
  }
}
