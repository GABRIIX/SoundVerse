import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Track } from '../../types';
import PlatformBadge from '../PlatformBadge';
import { colors, spacing, radius, typography } from '../../theme';
import { formatDuration } from '../../data/mockData';

interface Props {
  track: Track;
  onPress?: () => void;
  onLongPress?: () => void;
  showDuration?: boolean;
  compact?: boolean;
}

export default function TrackCard({
  track,
  onPress,
  onLongPress,
  showDuration = false,
  compact = false,
}: Props) {
  return (
    <TouchableOpacity
      style={[styles.container, compact && styles.containerCompact]}
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.7}
    >
      <Image source={{ uri: track.cover }} style={compact ? styles.coverSm : styles.cover} />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {track.title}
        </Text>
        <Text style={styles.artist} numberOfLines={1}>
          {track.artist.name}
          {track.featuring && track.featuring.length > 0
            ? ` ft. ${track.featuring.map(a => a.name).join(', ')}`
            : ''}
        </Text>
      </View>
      <View style={styles.right}>
        {showDuration && (
          <Text style={styles.duration}>{formatDuration(track.duration)}</Text>
        )}
        <PlatformBadge platform={track.platform} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.base,
    backgroundColor: 'transparent',
  },
  containerCompact: {
    paddingVertical: spacing.xs,
  },
  cover: {
    width: 52,
    height: 52,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceVariant,
  },
  coverSm: {
    width: 42,
    height: 42,
    borderRadius: radius.xs,
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
  artist: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  right: {
    alignItems: 'flex-end',
    gap: spacing.xs,
    marginLeft: spacing.sm,
  },
  duration: {
    ...typography.labelSmall,
    color: colors.textMuted,
  },
});
