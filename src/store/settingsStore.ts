import { create } from 'zustand';
import { AppSettings } from '../types';

const defaultSettings: AppSettings = {
  // Appearance
  theme: 'dark',
  accentColor: '#7C4DFF',
  backgroundColor: '#0D0D0D',
  textColor: '#FFFFFF',
  fontSize: 'normal',
  reduceAnimations: false,
  highContrast: false,
  hapticFeedback: true,

  // Streaming
  streamingFormat: 'mp3',
  streamingQuality: '320kbps',
  streamingQualityMobile: '256kbps',
  crossfade: true,
  crossfadeDuration: 3,
  normalizeVolume: true,
  wifiOnlyStreaming: false,

  // Download
  downloadFormat: 'mp3',
  downloadQuality: '320kbps',
  confirmBeforeDownload: false,
  downloadFolder: '/Downloads/VerseMusic',
  wifiOnlyDownload: true,
  autoDownloadLiked: false,
  downloadTimeout: 30,

  // Privacy
  profilePublic: true,
  showStats: 'friends',
  showPlaylists: 'all',
  authOnStart: false,

  // Notifications
  notifyNewReleases: true,
  notifyMessages: true,
  notifyFollowRequests: true,
  notifyUpcomingTracks: true,
  notifyListenTogether: true,
  notifyNews: false,
  notifyGameChallenges: true,
  notifyAppUpdates: true,
  notifySyncConfirm: true,
  notifyListenReminder: false,
  listenReminderDays: 3,

  // Chat
  readReceipts: true,
  linkPreview: true,
  autoplayReceivedTracks: false,
  showOnlineStatus: true,
  whoCanMessage: 'friends',

  // Bot
  botLanguage: 'it',
  botVoiceResponse: false,
  saveBotHistory: true,
  botPlatformPriority: ['youtube', 'spotify', 'soundcloud', 'appleMusic'],

  // Games
  defaultDifficulty: 'medium',
  gameTrackSource: 'library',
  gameSounds: true,

  // News
  defaultReadMode: 'essential',
  autoUpdateNews: true,
  newsUpdateFrequency: '6h',
  notifyNewArticles: false,
};

interface SettingsState {
  settings: AppSettings;
  update: (partial: Partial<AppSettings>) => void;
  reset: () => void;
  resetSection: (keys: (keyof AppSettings)[]) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  settings: defaultSettings,
  update: (partial) =>
    set(s => ({ settings: { ...s.settings, ...partial } })),
  reset: () => set({ settings: defaultSettings }),
  resetSection: (keys) =>
    set(s => {
      const patch: Partial<AppSettings> = {};
      keys.forEach(k => {
        (patch as any)[k] = (defaultSettings as any)[k];
      });
      return { settings: { ...s.settings, ...patch } };
    }),
}));
