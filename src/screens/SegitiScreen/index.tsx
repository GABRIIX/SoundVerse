import React from 'react';
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
      <Text style={styles.artistName} numberOfLines={1}>{item.name.toUpperCase()}</Text>
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
        <Text style={styles.trackTitle} numberOfLines={1}>{item.title.toUpperCase()}</Text>
        <Text style={styles.trackArtist} numberOfLines={1}>{item.artist.name.toUpperCase()}</Text>
        <PlatformBadge platform={item.platform} size="sm" />
      </View>
    </TouchableOpacity>
  );

  const sortedTracks = [...TRACKS].sort(
    (a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime(),
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.bullet} />
          <Text style={styles.headerTitle}>SEGUITI</Text>
        </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  bullet: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: colors.text,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.text,
    letterSpacing: 1.5,
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
    backgroundColor: colors.borderFaint,
    marginVertical: spacing.sm,
    marginHorizontal: spacing.sm,
  },
  colHeader: {
    fontSize: 9,
    fontWeight: '600',
    color: colors.textSecondary,
    letterSpacing: 2,
    textTransform: 'uppercase',
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
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: colors.surfaceVariant,
  },
  artistName: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    letterSpacing: 0.5,
  },
  trackList: {
    paddingBottom: spacing.xl,
    gap: spacing.sm,
  },
  trackCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.xs,
    overflow: 'hidden',
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderFaint,
  },
  trackCover: {
    width: 56,
    height: 56,
    backgroundColor: colors.surfaceVariant,
  },
  trackInfo: {
    flex: 1,
    padding: spacing.sm,
    gap: 3,
  },
  trackTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: colors.text,
    letterSpacing: 0.3,
  },
  trackArtist: {
    fontSize: 9,
    fontWeight: '600',
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
});
