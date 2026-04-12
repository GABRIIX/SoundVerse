import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { usePlayerStore } from '../../store/playerStore';
import { colors, gradients, spacing, radius, typography, MINI_PLAYER_HEIGHT } from '../../theme';

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
    <Pressable onPress={togglePlayerExpanded}>
      <LinearGradient
        colors={gradients.miniPlayer}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.container}
      >
        {/* Cover */}
        <Image source={{ uri: currentTrack.cover }} style={styles.cover} />

        {/* Track info */}
        <View style={styles.info}>
          <Text style={styles.trackName} numberOfLines={1}>
            {currentTrack.title}
          </Text>
          <Text style={styles.artistName} numberOfLines={1}>
            {currentTrack.artist.name.toUpperCase()}
          </Text>
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          <TouchableOpacity
            onPress={(e) => { e.stopPropagation(); prev(); }}
            hitSlop={{ top: 12, bottom: 12, left: 8, right: 8 }}
            style={styles.controlBtn}
          >
            <Text style={styles.controlIcon}>◂</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={(e) => { e.stopPropagation(); next(); }}
            hitSlop={{ top: 12, bottom: 12, left: 8, right: 8 }}
            style={styles.controlBtn}
          >
            <Text style={styles.controlIcon}>▸</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={(e) => { e.stopPropagation(); toggleLike(currentTrack.id); }}
            hitSlop={{ top: 12, bottom: 12, left: 8, right: 8 }}
            style={styles.controlBtn}
          >
            <Text style={[styles.controlIcon, currentTrack.liked && styles.likedIcon]}>
              {currentTrack.liked ? '♥' : '♡'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={(e) => { e.stopPropagation(); togglePlayPause(); }}
            hitSlop={{ top: 12, bottom: 12, left: 8, right: 8 }}
            style={styles.playBtn}
          >
            <Text style={styles.playIcon}>{isPlaying ? '⏸' : '▶'}</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    height: MINI_PLAYER_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    gap: spacing.md,
  },
  cover: {
    width: 46,
    height: 46,
    borderRadius: radius.xs,
    backgroundColor: colors.surfaceVariant,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  trackName: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: 0.3,
  },
  artistName: {
    fontSize: 10,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.55)',
    letterSpacing: 1.2,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  controlBtn: {
    padding: spacing.xs,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlIcon: {
    fontSize: 20,
    color: 'rgba(255,255,255,0.85)',
  },
  likedIcon: {
    color: '#FF6B9D',
  },
  playBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 2,
  },
  playIcon: {
    fontSize: 16,
    color: '#FFFFFF',
  },
});
