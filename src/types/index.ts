export type Platform = 'spotify' | 'youtube' | 'soundcloud' | 'appleMusic';

export type Genre =
  | 'rap'
  | 'trap'
  | 'drill'
  | 'rnb'
  | 'pop'
  | 'afrobeat'
  | 'reggaeton'
  | 'soul'
  | 'jazz'
  | 'elettronica';

export interface Artist {
  id: string;
  name: string;
  avatar: string;
  genre: Genre;
  followers: number;
  verified: boolean;
  bio?: string;
  platforms: Partial<Record<Platform, string>>;
}

export interface Track {
  id: string;
  title: string;
  artist: Artist;
  featuring?: Artist[];
  album?: Album;
  cover: string;
  duration: number; // seconds
  genre: Genre;
  platform: Platform;
  releaseDate: string; // ISO date string
  addedAt: string;    // ISO date string
  streams?: number;
  liked: boolean;
  downloadedPath?: string;
  quality?: '128kbps' | '256kbps' | '320kbps' | 'lossless';
  lyrics?: string;
  videoUrl?: string;
}

export interface Album {
  id: string;
  title: string;
  artist: Artist;
  cover: string;
  releaseDate: string;
  addedAt: string;
  tracks: Track[];
  platform: Platform;
  genre: Genre;
}

export interface Playlist {
  id: string;
  name: string;
  cover: string;
  tracks: Track[];
  isPrivate: boolean;
  isSystem: boolean; // true for "Brani che ti piacciono"
  createdAt: string;
  updatedAt: string;
  ownerId: string;
}

export interface UserProfile {
  id: string;
  nickname: string;
  realName: string;
  email: string;
  avatar: string;
  isPublic: boolean;
  followedArtists: Artist[];
  friends: UserProfile[];
  connectedPlatforms: Partial<Record<Platform, boolean>>;
  followersCount: number;
  totalPlays: number;
  totalLikes: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  type: 'text' | 'track' | 'playlist' | 'album';
  trackRef?: Track;
  playlistRef?: Playlist;
  albumRef?: Album;
  reactions?: Record<string, string[]>;
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  source: string;
  sourceUrl: string;
  publishedAt: string;
  imageUrl?: string;
}

export interface StatsPeriod {
  type: 'day' | 'week' | 'month' | 'year' | 'range';
  from: Date;
  to: Date;
}

export interface StatsData {
  minutesListened: number;
  topGenre: Genre;
  topGenreCover: string;
  topArtists: Array<{ artist: Artist; playCount: number }>;
  topTracks: Array<{ track: Track; playCount: number }>;
  topAlbums: Array<{ album: Album; playCount: number }>;
  topPlaylists: Array<{ playlist: Playlist; playCount: number }>;
}

export type SortCriteria =
  | 'addedDesc'
  | 'addedAsc'
  | 'modifiedDesc'
  | 'modifiedAsc'
  | 'releaseDateDesc'
  | 'releaseDateAsc'
  | 'titleAsc'
  | 'titleDesc'
  | 'platformDesc'
  | 'platformAsc';

export type HomeTab = 'canzoni' | 'album' | 'playlist';
export type HomeSwipeScreen = 'seguiti' | 'novita' | 'statistiche';

export type QualityOption = '128kbps' | '256kbps' | '320kbps' | 'lossless';
export type AudioFormat = 'mp3' | 'mp4' | 'aac' | 'flac' | 'ogg';

export interface AppSettings {
  // Appearance
  theme: 'dark' | 'light' | 'system';
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  fontSize: 'small' | 'normal' | 'large' | 'xlarge';
  fontFamily: 'Koulen' | 'Oswald' | 'BebasNeue' | 'Anton' | 'RussoOne' | 'System';
  reduceAnimations: boolean;
  highContrast: boolean;
  hapticFeedback: boolean;

  // Streaming
  streamingFormat: AudioFormat;
  streamingQuality: QualityOption;
  streamingQualityMobile: QualityOption;
  crossfade: boolean;
  crossfadeDuration: number;
  normalizeVolume: boolean;
  wifiOnlyStreaming: boolean;

  // Download
  downloadFormat: AudioFormat;
  downloadQuality: QualityOption;
  confirmBeforeDownload: boolean;
  downloadFolder: string;
  wifiOnlyDownload: boolean;
  autoDownloadLiked: boolean;
  downloadTimeout: number; // minutes

  // Privacy
  profilePublic: boolean;
  showStats: 'all' | 'friends' | 'only_me';
  showPlaylists: 'all' | 'friends';
  authOnStart: boolean;

  // Notifications
  notifyNewReleases: boolean;
  notifyMessages: boolean;
  notifyFollowRequests: boolean;
  notifyUpcomingTracks: boolean;
  notifyListenTogether: boolean;
  notifyNews: boolean;
  notifyGameChallenges: boolean;
  notifyAppUpdates: boolean;
  notifySyncConfirm: boolean;
  notifyListenReminder: boolean;
  listenReminderDays: number;

  // Chat
  readReceipts: boolean;
  linkPreview: boolean;
  autoplayReceivedTracks: boolean;
  showOnlineStatus: boolean;
  whoCanMessage: 'all' | 'friends' | 'nobody';

  // Bot
  botLanguage: 'it' | 'en' | 'system';
  botVoiceResponse: boolean;
  saveBotHistory: boolean;
  botPlatformPriority: Platform[];

  // Games
  defaultDifficulty: 'easy' | 'medium' | 'hard';
  gameTrackSource: 'followed' | 'liked' | 'library';
  gameSounds: boolean;

  // News
  defaultReadMode: 'essential' | 'original';
  autoUpdateNews: boolean;
  newsUpdateFrequency: '1h' | '6h' | '12h' | '24h';
  notifyNewArticles: boolean;
}
