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
  rap: '♪',
  trap: '◈',
  drill: '⚡',
  rnb: '◉',
  pop: '★',
  afrobeat: '◆',
  reggaeton: '◇',
  soul: '♦',
  jazz: '♫',
  elettronica: '◎',
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

  const loopLabel = loopMode === 'none' ? '↻' : loopMode === 'playlist' ? '↻' : '↺';
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
            <Text style={styles.genreIcon}>{GENRE_ICONS[currentTrack.genre] ?? '♪'}</Text>
            <Text style={styles.genreText}>{currentTrack.genre.toUpperCase()}</Text>
          </View>
          <View style={styles.platformOverlay}>
            <PlatformBadge platform={currentTrack.platform} size="md" />
          </View>
        </View>

        {/* Track info */}
        <View style={styles.trackInfo}>
          <View style={styles.trackInfoLeft}>
            <Text style={styles.trackTitle} numberOfLines={1}>{currentTrack.title.toUpperCase()}</Text>
            <Text style={styles.trackArtist} numberOfLines={1}>
              {currentTrack.artist.name.toUpperCase()}
              {currentTrack.featuring?.length
                ? ` FT. ${currentTrack.featuring.map(a => a.name.toUpperCase()).join(', ')}`
                : ''}
            </Text>
          </View>
          <TouchableOpacity onPress={() => toggleLike(currentTrack.id)} style={styles.likeBtn}>
            <Text style={[styles.likeIcon, currentTrack.liked && styles.likedIcon]}>
              {currentTrack.liked ? '♥' : '♡'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Progress bar */}
        <View style={styles.progressSection}>
          <TouchableOpacity
            style={styles.progressBg}
            onPress={e => {
              const ratio = e.nativeEvent.locationX / (SCREEN_WIDTH - spacing.base * 2);
              setProgress(Math.max(0, Math.min(1, ratio)));
            }}
            activeOpacity={1}
          >
            <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
            <View style={[styles.progressThumb, { left: `${progress * 100}%` as any }]} />
          </TouchableOpacity>
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
            <Text style={styles.prevNextIcon}>◂◂</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={togglePlayPause} style={styles.playPauseBtn}>
            <Text style={styles.playPauseIcon}>{isPlaying ? '⏸' : '▶'}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={next} style={styles.prevNextBtn}>
            <Text style={styles.prevNextIcon}>▸▸</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={cycleLoop} style={styles.sideControl}>
            <Text style={[styles.sideIcon, { color: loopColor }]}>
              {loopMode === 'track' ? '①' : loopLabel}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Secondary controls */}
        <View style={styles.secondaryControls}>
          <ControlButton icon="≡" label="SUCCESSIVI" onPress={() => setShowQueue(true)} />
          <ControlButton
            icon={isLimitedToPlaylist ? '⊙' : '○'}
            label="PLAYLIST"
            active={isLimitedToPlaylist}
            onPress={toggleLimitToPlaylist}
          />
          <ControlButton icon="⬇" label="DOWNLOAD" onPress={() => {}} />
          <ControlButton icon="↑" label="CONDIVIDI" onPress={() => {}} />
          <ControlButton icon="ⓘ" label="INFO" onPress={() => setShowInfo(true)} />
        </View>

        {/* Lyrics toggle */}
        <TouchableOpacity style={styles.lyricsToggle} onPress={() => setShowLyrics(l => !l)}>
          <Text style={styles.lyricsToggleText}>
            {showLyrics ? '▴  NASCONDI TESTO' : '▾  MOSTRA TESTO'}
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
              <Text style={styles.genreIconLabel}>{g.toUpperCase()}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Queue modal */}
      <Modal visible={showQueue} transparent animationType="slide" onRequestClose={() => setShowQueue(false)}>
        <View style={styles.queueOverlay}>
          <View style={styles.queueSheet}>
            <View style={styles.queueHandle} />
            <Text style={styles.queueTitle}>SUCCESSIVI ({queue.length})</Text>
            <ScrollView>
              {queue.map((t, i) => (
                <View
                  key={t.id}
                  style={[styles.queueItem, t.id === currentTrack.id && styles.queueItemActive]}
                >
                  <Text style={styles.queueNum}>{i + 1}</Text>
                  <Image source={{ uri: t.cover }} style={styles.queueCover} />
                  <View style={styles.queueInfo}>
                    <Text style={styles.queueTrackTitle} numberOfLines={1}>{t.title.toUpperCase()}</Text>
                    <Text style={styles.queueTrackArtist} numberOfLines={1}>{t.artist.name.toUpperCase()}</Text>
                  </View>
                  <PlatformBadge platform={t.platform} />
                </View>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.queueCloseBtn} onPress={() => setShowQueue(false)}>
              <Text style={styles.queueCloseText}>CHIUDI</Text>
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
              ['TITOLO', currentTrack.title],
              ['ARTISTA', currentTrack.artist.name],
              ['DATA USCITA', currentTrack.releaseDate],
              ['GENERE', currentTrack.genre.toUpperCase()],
              ['PIATTAFORMA', currentTrack.platform.toUpperCase()],
              ['QUALITÀ', currentTrack.quality ?? 'N/D'],
              ['DURATA', formatDuration(currentTrack.duration)],
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
  btn: { alignItems: 'center', gap: 3 },
  icon: { fontSize: 20, color: colors.textSecondary },
  label: {
    fontSize: 8,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 1,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surfaceModal,
  },
  handle: {
    width: 36,
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
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  genreIcon: { fontSize: 13, color: '#FFF' },
  genreText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#FFF',
    letterSpacing: 1.5,
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
    fontSize: 22,
    fontWeight: '900',
    color: colors.text,
    letterSpacing: 0.5,
  },
  trackArtist: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    letterSpacing: 1,
    marginTop: 3,
  },
  likeBtn: { padding: spacing.sm },
  likeIcon: { fontSize: 28, color: colors.textMuted },
  likedIcon: { color: '#FF6B9D' },
  progressSection: { gap: spacing.sm },
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
    top: -6,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FFF',
    marginLeft: -8,
    ...shadows.small,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressTime: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textMuted,
    letterSpacing: 0.5,
  },
  mainControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sideControl: { padding: spacing.md },
  sideIcon: { fontSize: 24, color: colors.textSecondary },
  prevNextBtn: { padding: spacing.md },
  prevNextIcon: { fontSize: 22, color: colors.text, letterSpacing: -2 },
  playPauseBtn: {
    width: 76,
    height: 76,
    borderRadius: 38,
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
    borderColor: colors.borderFaint,
  },
  lyricsToggle: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  lyricsToggleText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 1.5,
  },
  lyricsSection: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: colors.borderFaint,
  },
  lyricsText: {
    fontSize: 13,
    fontWeight: '400',
    color: colors.textSecondary,
    lineHeight: 22,
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
    width: 58,
    gap: 2,
  },
  genreIconText: { fontSize: 22, color: colors.textSecondary },
  genreIconLabel: {
    fontSize: 7,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 0.8,
  },
  // Queue
  queueOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  queueSheet: {
    backgroundColor: colors.surfaceElevated,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    maxHeight: '70%',
    padding: spacing.base,
    borderTopWidth: 1,
    borderColor: colors.borderFaint,
  },
  queueHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginBottom: spacing.md,
  },
  queueTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 2,
    marginBottom: spacing.md,
  },
  queueItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    gap: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.borderFaint,
  },
  queueItemActive: { backgroundColor: colors.accentContainer },
  queueNum: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textMuted,
    width: 20,
    textAlign: 'center',
  },
  queueCover: {
    width: 40,
    height: 40,
    borderRadius: radius.xs,
    backgroundColor: colors.surfaceVariant,
  },
  queueInfo: { flex: 1 },
  queueTrackTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: colors.text,
    letterSpacing: 0.3,
  },
  queueTrackArtist: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textSecondary,
    letterSpacing: 0.5,
    marginTop: 1,
  },
  queueCloseBtn: {
    marginTop: spacing.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceVariant,
  },
  queueCloseText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 1.5,
  },
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
    borderColor: colors.borderFaint,
    gap: spacing.xs,
  },
  infoTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 2,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.borderFaint,
  },
  infoLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textSecondary,
    letterSpacing: 1,
  },
  infoValue: {
    fontSize: 12,
    fontWeight: '900',
    color: colors.text,
    letterSpacing: 0.3,
  },
});
