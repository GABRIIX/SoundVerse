import React, { useRef } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { ARTISTS, TRACKS } from '../../data/mockData';
import PlatformBadge from '../../components/PlatformBadge';
import { usePlayerStore } from '../../store/playerStore';
import { colors, spacing, radius, typography } from '../../theme';

export default function SegitiScreen() {
  const { play } = usePlayerStore();

  const renderArtist = ({ item }: { item: typeof ARTISTS[0] }) => (
    <TouchableOpacity style={styles.artistItem} activeOpacity={0.75}>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <Text style={styles.artistName} numberOfLines={1}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderTrack = ({ item }: { item: typeof TRACKS[0] }) => (
    <TouchableOpacity
      style={styles.trackCard}
      onPress={() => play(item)}
      activeOpacity={0.75}
    >
      <Image source={{ uri: item.cover }} style={styles.trackCover} />
      <View style={styles.trackInfo}>
        <Text style={styles.trackTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.trackArtist} numberOfLines={1}>{item.artist.name}</Text>
        <PlatformBadge platform={item.platform} size="sm" />
      </View>
    </TouchableOpacity>
  );

  // Sort tracks by release date desc
  const sortedTracks = [...TRACKS].sort(
    (a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime(),
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>SEGUITI</Text>
      </View>

      <View style={styles.columns}>
        {/* Left column — Artists */}
        <View style={styles.leftCol}>
          <Text style={styles.colHeader}>ARTISTI</Text>
          <FlatList
            data={ARTISTS}
            keyExtractor={a => a.id}
            renderItem={renderArtist}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.artistList}
            nestedScrollEnabled
          />
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Right column — Recent tracks */}
        <View style={styles.rightCol}>
          <Text style={styles.colHeader}>RECENTI</Text>
          <FlatList
            data={sortedTracks}
            keyExtractor={t => t.id}
            renderItem={renderTrack}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.trackList}
            nestedScrollEnabled
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  headerTitle: {
    ...typography.headlineSmall,
    color: colors.text,
    letterSpacing: 2,
  },
  columns: {
    flex: 1,
    flexDirection: 'row',
  },
  leftCol: {
    width: 110,
    paddingLeft: spacing.base,
  },
  rightCol: {
    flex: 1,
    paddingRight: spacing.base,
  },
  divider: {
    width: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
    marginHorizontal: spacing.sm,
  },
  colHeader: {
    ...typography.labelSmall,
    color: colors.textMuted,
    letterSpacing: 1.5,
    marginBottom: spacing.sm,
    marginTop: spacing.xs,
  },
  artistList: {
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
  artistItem: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.surfaceVariant,
  },
  artistName: {
    ...typography.labelSmall,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
  trackList: {
    paddingBottom: spacing.xl,
    gap: spacing.sm,
  },
  trackCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.sm,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  trackCover: {
    width: 64,
    height: 64,
    backgroundColor: colors.surfaceVariant,
  },
  trackInfo: {
    flex: 1,
    padding: spacing.sm,
    gap: 3,
  },
  trackTitle: {
    ...typography.titleSmall,
    color: colors.text,
  },
  trackArtist: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
});
