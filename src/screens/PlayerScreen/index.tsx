import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePlayerStore } from '../../store/playerStore';
import PlatformBadge from '../../components/PlatformBadge';
import { colors, spacing, radius, typography, shadows } from '../../theme';
import { formatDuration } from '../../data/mockData';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const COVER_SIZE = SCREEN_WIDTH - spacing.base * 2;

const GENRE_ICONS: Record<string, string> = {
  rap: '🎤',
  trap: '🔫',
  drill: '⚡',
  rnb: '🎶',
  pop: '⭐',
  afrobeat: '🌍',
  reggaeton: '🏝',
  soul: '💜',
  jazz: '🎷',
  elettronica: '🎧',
};

export default function PlayerScreen() {
  const insets = useSafeAreaInsets();
  const {
    currentTrack,
    isPlaying,
    togglePlayPause,
    next,
    prev,
    isShuffled,
    toggleShuffle,
    loopMode,
    cycleLoop,
    progress,
    setProgress,
    toggleLike,
    isLimitedToPlaylist,
    toggleLimitToPlaylist,
    queue,
    togglePlayerExpanded,
  } = usePlayerStore();

  const [showQueue, setShowQueue] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  if (!currentTrack) return null;

  const elapsed = Math.floor(progress * currentTrack.duration);
  const remaining = currentTrack.duration - elapsed;

  const loopIcon = loopMode === 'none' ? '↻' : loopMode === 'playlist' ? '🔁' : '🔂';
  const loopColor = loopMode === 'none' ? colors.textMuted : colors.accent;

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {/* Drag handle */}
      <View style={styles.handle} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Cover */}
        <View style={styles.coverSection}>
          <Image source={{ uri: currentTrack.cover }} style={styles.cover} />
          <View style={styles.genreOverlay}>
            <Text style={styles.genreIcon}>{GENRE_ICONS[currentTrack.genre] ?? '🎵'}</Text>
            <Text style={styles.genreText}>{currentTrack.genre.toUpperCase()}</Text>
          </View>
          <View style={styles.platformOverlay}>
            <PlatformBadge platform={currentTrack.platform} size="md" />
          </View>
        </View>

        {/* Track info */}
        <View style={styles.trackInfo}>
          <View style={styles.trackInfoLeft}>
            <Text style={styles.trackTitle} numberOfLines={1}>{currentTrack.title}</Text>
            <Text style={styles.trackArtist} numberOfLines={1}>
              {currentTrack.artist.name}
              {currentTrack.featuring?.length
                ? ` ft. ${currentTrack.featuring.map(a => a.name).join(', ')}`
                : ''}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => toggleLike(currentTrack.id)}
            style={styles.likeBtn}
          >
            <Text style={[styles.likeIcon, currentTrack.liked && styles.likedIcon]}>
              {currentTrack.liked ? '♥' : '♡'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Progress bar */}
        <View style={styles.progressSection}>
          <View style={styles.progressBg}>
            <TouchableOpacity
              style={styles.progressBg}
              onPress={e => {
                const ratio = e.nativeEvent.locationX / (SCREEN_WIDTH - spacing.base * 2);
                setProgress(Math.max(0, Math.min(1, ratio)));
              }}
              activeOpacity={1}
            >
              <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
              <View style={[styles.progressThumb, { left: `${progress * 100}%` }]} />
            </TouchableOpacity>
          </View>
          <View style={styles.progressLabels}>
            <Text style={styles.progressTime}>{formatDuration(elapsed)}</Text>
            <Text style={styles.progressTime}>−{formatDuration(remaining)}</Text>
          </View>
        </View>

        {/* Main controls */}
        <View style={styles.mainControls}>
          <TouchableOpacity onPress={toggleShuffle} style={styles.sideControl}>
            <Text style={[styles.sideIcon, isShuffled && { color: colors.accent }]}>⇄</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={prev} style={styles.prevNextBtn}>
            <Text style={styles.prevNextIcon}>⏮</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={togglePlayPause} style={styles.playPauseBtn}>
            <Text style={styles.playPauseIcon}>{isPlaying ? '⏸' : '▶'}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={next} style={styles.prevNextBtn}>
            <Text style={styles.prevNextIcon}>⏭</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={cycleLoop} style={styles.sideControl}>
            <Text style={[styles.sideIcon, { color: loopColor }]}>{loopIcon}</Text>
          </TouchableOpacity>
        </View>

        {/* Secondary controls */}
        <View style={styles.secondaryControls}>
          <ControlButton icon="📋" label="Successivi" onPress={() => setShowQueue(true)} />
          <ControlButton
            icon={isLimitedToPlaylist ? '🔒' : '🔓'}
            label="Solo playlist"
            active={isLimitedToPlaylist}
            onPress={toggleLimitToPlaylist}
          />
          <ControlButton icon="⬇" label="Download" onPress={() => {}} />
          <ControlButton icon="↑" label="Condividi" onPress={() => {}} />
          <ControlButton icon="ℹ" label="Info" onPress={() => setShowInfo(true)} />
        </View>

        {/* Lyrics toggle */}
        <TouchableOpacity
          style={styles.lyricsToggle}
          onPress={() => setShowLyrics(l => !l)}
        >
          <Text style={styles.lyricsToggleText}>
            {showLyrics ? '▴ Nascondi testo' : '▾ Mostra testo'}
          </Text>
        </TouchableOpacity>

        {showLyrics && (
          <View style={styles.lyricsSection}>
            <Text style={styles.lyricsText}>
              {currentTrack.lyrics ?? 'Testo non disponibile per questo brano.'}
            </Text>
          </View>
        )}

        {/* Genre icons row */}
        <View style={styles.genreIcons}>
          {Object.entries(GENRE_ICONS).map(([g, icon]) => (
            <TouchableOpacity key={g} style={styles.genreIconBtn}>
              <Text style={styles.genreIconText}>{icon}</Text>
              <Text style={styles.genreIconLabel}>{g}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Queue modal */}
      <Modal visible={showQueue} transparent animationType="slide" onRequestClose={() => setShowQueue(false)}>
        <View style={styles.queueOverlay}>
          <View style={styles.queueSheet}>
            <View style={styles.queueHandle} />
            <Text style={styles.queueTitle}>TRACCE SUCCESSIVE ({queue.length})</Text>
            <ScrollView>
              {queue.map((t, i) => (
                <View
                  key={t.id}
                  style={[
                    styles.queueItem,
                    t.id === currentTrack.id && styles.queueItemActive,
                  ]}
                >
                  <Text style={styles.queueNum}>{i + 1}</Text>
                  <Image source={{ uri: t.cover }} style={styles.queueCover} />
                  <View style={styles.queueInfo}>
                    <Text style={styles.queueTrackTitle} numberOfLines={1}>{t.title}</Text>
                    <Text style={styles.queueTrackArtist} numberOfLines={1}>{t.artist.name}</Text>
                  </View>
                  <PlatformBadge platform={t.platform} />
                </View>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.queueCloseBtn} onPress={() => setShowQueue(false)}>
              <Text style={styles.queueCloseText}>Chiudi</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Info modal */}
      <Modal visible={showInfo} transparent animationType="fade" onRequestClose={() => setShowInfo(false)}>
        <TouchableOpacity style={styles.infoOverlay} onPress={() => setShowInfo(false)} activeOpacity={1}>
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>INFORMAZIONI BRANO</Text>
            {[
              ['Titolo', currentTrack.title],
              ['Artista', currentTrack.artist.name],
              ['Data uscita', currentTrack.releaseDate],
              ['Genere', currentTrack.genre.toUpperCase()],
              ['Piattaforma', currentTrack.platform.toUpperCase()],
              ['Qualità', currentTrack.quality ?? 'N/D'],
              ['Durata', formatDuration(currentTrack.duration)],
            ].map(([label, val]) => (
              <View key={label} style={styles.infoRow}>
                <Text style={styles.infoLabel}>{label}</Text>
                <Text style={styles.infoValue}>{val}</Text>
              </View>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

function ControlButton({
  icon,
  label,
  onPress,
  active = false,
}: {
  icon: string;
  label: string;
  onPress: () => void;
  active?: boolean;
}) {
  return (
    <TouchableOpacity style={ctrlStyles.btn} onPress={onPress} activeOpacity={0.7}>
      <Text style={[ctrlStyles.icon, active && { color: colors.accent }]}>{icon}</Text>
      <Text style={[ctrlStyles.label, active && { color: colors.accent }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const ctrlStyles = StyleSheet.create({
  btn: { alignItems: 'center', gap: 2 },
  icon: { fontSize: 20, color: colors.textSecondary },
  label: { ...typography.labelSmall, color: colors.textMuted, fontSize: 9 },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surfaceModal,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  content: {
    padding: spacing.base,
    paddingBottom: spacing.xxxl,
    gap: spacing.lg,
  },
  coverSection: {
    position: 'relative',
    borderRadius: radius.xl,
    overflow: 'hidden',
    ...shadows.large,
  },
  cover: {
    width: COVER_SIZE,
    height: COVER_SIZE,
    borderRadius: radius.xl,
    backgroundColor: colors.surfaceVariant,
  },
  genreOverlay: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  genreIcon: { fontSize: 14 },
  genreText: {
    ...typography.labelSmall,
    color: '#FFF',
    letterSpacing: 1,
    fontWeight: '700',
  },
  platformOverlay: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
  },
  trackInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  trackInfoLeft: { flex: 1 },
  trackTitle: {
    ...typography.headlineSmall,
    color: colors.text,
  },
  trackArtist: {
    ...typography.bodyLarge,
    color: colors.textSecondary,
    marginTop: 2,
  },
  likeBtn: { padding: spacing.sm },
  likeIcon: { fontSize: 28, color: colors.textMuted },
  likedIcon: { color: colors.error },
  progressSection: { gap: spacing.xs },
  progressBg: {
    height: 4,
    backgroundColor: colors.surfaceVariant,
    borderRadius: 2,
    position: 'relative',
  },
  progressFill: {
    height: 4,
    backgroundColor: colors.accent,
    borderRadius: 2,
  },
  progressThumb: {
    position: 'absolute',
    top: -5,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#FFF',
    marginLeft: -7,
    ...shadows.small,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressTime: { ...typography.labelSmall, color: colors.textMuted },
  mainControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sideControl: { padding: spacing.md },
  sideIcon: { fontSize: 22, color: colors.textSecondary },
  prevNextBtn: { padding: spacing.md },
  prevNextIcon: { fontSize: 28, color: colors.text },
  playPauseBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.medium,
  },
  playPauseIcon: { fontSize: 28, color: '#FFF' },
  secondaryControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  lyricsToggle: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  lyricsToggleText: { ...typography.labelMedium, color: colors.textSecondary },
  lyricsSection: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: colors.border,
  },
  lyricsText: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  genreIcons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    gap: spacing.sm,
    paddingTop: spacing.sm,
  },
  genreIconBtn: {
    alignItems: 'center',
    width: 60,
    gap: 2,
  },
  genreIconText: { fontSize: 24 },
  genreIconLabel: { ...typography.labelSmall, color: colors.textMuted, fontSize: 9 },
  // Queue
  queueOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  queueSheet: {
    backgroundColor: colors.surfaceElevated,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    maxHeight: '70%',
    padding: spacing.base,
    borderTopWidth: 1,
    borderColor: colors.border,
  },
  queueHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginBottom: spacing.md,
  },
  queueTitle: {
    ...typography.labelSmall,
    color: colors.textMuted,
    letterSpacing: 1.5,
    marginBottom: spacing.md,
  },
  queueItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    gap: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderFaint,
  },
  queueItemActive: { backgroundColor: colors.accentContainer },
  queueNum: { ...typography.labelSmall, color: colors.textMuted, width: 20, textAlign: 'center' },
  queueCover: { width: 40, height: 40, borderRadius: radius.xs, backgroundColor: colors.surfaceVariant },
  queueInfo: { flex: 1 },
  queueTrackTitle: { ...typography.titleSmall, color: colors.text },
  queueTrackArtist: { ...typography.bodySmall, color: colors.textSecondary },
  queueCloseBtn: {
    marginTop: spacing.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderRadius: radius.md,
    backgroundColor: colors.surfaceVariant,
  },
  queueCloseText: { ...typography.labelLarge, color: colors.textSecondary },
  // Info modal
  infoOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  infoCard: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.xl,
    padding: spacing.xl,
    width: '100%',
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.xs,
  },
  infoTitle: {
    ...typography.labelSmall,
    color: colors.textMuted,
    letterSpacing: 1.5,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderFaint,
  },
  infoLabel: { ...typography.bodySmall, color: colors.textSecondary },
  infoValue: { ...typography.bodySmall, color: colors.text, fontWeight: '600' },
});
