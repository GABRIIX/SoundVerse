import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from 'react-native';
import { usePlayerStore } from '../../store/playerStore';
import { colors, spacing, radius, typography, MINI_PLAYER_HEIGHT, shadows } from '../../theme';

export default function MiniPlayer() {
  const {
    currentTrack,
    isPlaying,
    togglePlayPause,
    next,
    prev,
    toggleLike,
    togglePlayerExpanded,
  } = usePlayerStore();

  if (!currentTrack) return null;

  return (
    <Pressable onPress={togglePlayerExpanded} style={styles.container}>
      {/* Left: cover + info */}
      <View style={styles.left}>
        <Image source={{ uri: currentTrack.cover }} style={styles.cover} />
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={1}>
            {currentTrack.title}
          </Text>
          <View style={styles.subRow}>
            <Text style={styles.artist} numberOfLines={1}>
              {currentTrack.artist.name}
            </Text>
            <View style={styles.genreBadge}>
              <Text style={styles.genreText}>{currentTrack.genre.toUpperCase()}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Right: controls */}
      <View style={styles.controls}>
        <TouchableOpacity
          onPress={(e) => { e.stopPropagation(); prev(); }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={styles.iconBtn}
        >
          <Text style={styles.icon}>⏮</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={(e) => { e.stopPropagation(); togglePlayPause(); }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={[styles.iconBtn, styles.playBtn]}
        >
          <Text style={styles.playIcon}>{isPlaying ? '⏸' : '▶'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={(e) => { e.stopPropagation(); next(); }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={styles.iconBtn}
        >
          <Text style={styles.icon}>⏭</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={(e) => { e.stopPropagation(); toggleLike(currentTrack.id); }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={styles.iconBtn}
        >
          <Text style={[styles.icon, currentTrack.liked && styles.liked]}>
            {currentTrack.liked ? '♥' : '♡'}
          </Text>
        </TouchableOpacity>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    height: MINI_PLAYER_HEIGHT,
    backgroundColor: colors.surfaceElevated,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    ...shadows.medium,
  },
  left: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  cover: {
    width: 48,
    height: 48,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceVariant,
  },
  info: {
    flex: 1,
    marginLeft: spacing.md,
  },
  title: {
    ...typography.titleSmall,
    color: colors.text,
    marginBottom: 2,
  },
  subRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  artist: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    flex: 1,
  },
  genreBadge: {
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: radius.xs,
    backgroundColor: colors.accentContainer,
  },
  genreText: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.accent,
    letterSpacing: 0.5,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginLeft: spacing.sm,
  },
  iconBtn: {
    padding: spacing.xs,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.accent,
  },
  icon: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  playIcon: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  liked: {
    color: colors.error,
  },
});
