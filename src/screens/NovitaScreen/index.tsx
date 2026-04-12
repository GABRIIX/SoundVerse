import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { HomeTab, SortCriteria } from '../../types';
import { TRACKS, ALBUMS, PLAYLISTS } from '../../data/mockData';
import PlatformBadge from '../../components/PlatformBadge';
import SortFilterBar from '../../components/SortFilterBar';
import { usePlayerStore } from '../../store/playerStore';
import { colors, spacing, radius, typography } from '../../theme';

const SCREEN_WIDTH = Dimensions.get('window').width;
const GRID_COLS = 4;
const CELL_SIZE = (SCREEN_WIDTH - spacing.base * 2 - spacing.sm * (GRID_COLS - 1)) / GRID_COLS;

const TABS: { key: HomeTab; label: string }[] = [
  { key: 'canzoni', label: 'CANZONI' },
  { key: 'album', label: 'ALBUM' },
  { key: 'playlist', label: 'PLAYLIST' },
];

export default function NovitaScreen() {
  const [activeTab, setActiveTab] = useState<HomeTab>('canzoni');
  const [sort, setSort] = useState<SortCriteria>('addedDesc');
  const { play } = usePlayerStore();

  const data = activeTab === 'canzoni' ? TRACKS : activeTab === 'album' ? ALBUMS : PLAYLISTS;

  const renderTrackCell = ({ item }: { item: typeof TRACKS[0] }) => (
    <TouchableOpacity style={styles.cell} onPress={() => play(item)} activeOpacity={0.75}>
      <View style={styles.coverWrap}>
        <Image source={{ uri: item.cover }} style={styles.cellCover} />
        <View style={styles.badgeOverlay}>
          <PlatformBadge platform={item.platform} size="sm" />
        </View>
      </View>
      <Text style={styles.cellArtist} numberOfLines={1}>{item.artist.name}</Text>
      <Text style={styles.cellTitle} numberOfLines={1}>{item.title}</Text>
    </TouchableOpacity>
  );

  const renderAlbumCell = ({ item }: { item: typeof ALBUMS[0] }) => (
    <TouchableOpacity style={styles.cell} activeOpacity={0.75}>
      <View style={styles.coverWrap}>
        <Image source={{ uri: item.cover }} style={styles.cellCover} />
        <View style={styles.badgeOverlay}>
          <PlatformBadge platform={item.platform} size="sm" />
        </View>
      </View>
      <Text style={styles.cellArtist} numberOfLines={1}>{item.artist.name}</Text>
      <Text style={styles.cellTitle} numberOfLines={1}>{item.title}</Text>
    </TouchableOpacity>
  );

  const renderPlaylistCell = ({ item }: { item: typeof PLAYLISTS[0] }) => (
    <TouchableOpacity style={styles.cell} activeOpacity={0.75}>
      <View style={styles.coverWrap}>
        <Image source={{ uri: item.cover }} style={styles.cellCover} />
        <View style={styles.playlistCountBadge}>
          <Text style={styles.playlistCountText}>{item.tracks.length}</Text>
        </View>
      </View>
      <Text style={styles.cellArtist} numberOfLines={1} />
      <Text style={styles.cellTitle} numberOfLines={1}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>NOVITÀ</Text>
        <Text style={styles.headerSub}>/ {TABS.find(t => t.key === activeTab)?.label}</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        {TABS.map(tab => (
          <TouchableOpacity
            key={tab.key}
            onPress={() => setActiveTab(tab.key)}
            style={[styles.tabBtn, activeTab === tab.key && styles.tabBtnActive]}
          >
            <Text
              style={[styles.tabLabel, activeTab === tab.key && styles.tabLabelActive]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Sort bar */}
      <SortFilterBar value={sort} onChange={setSort} />

      {/* Grid */}
      {activeTab === 'canzoni' && (
        <FlatList
          data={TRACKS}
          keyExtractor={i => i.id}
          renderItem={renderTrackCell}
          numColumns={GRID_COLS}
          contentContainerStyle={styles.grid}
          showsVerticalScrollIndicator={false}
        />
      )}
      {activeTab === 'album' && (
        <FlatList
          data={ALBUMS}
          keyExtractor={i => i.id}
          renderItem={renderAlbumCell}
          numColumns={GRID_COLS}
          contentContainerStyle={styles.grid}
          showsVerticalScrollIndicator={false}
        />
      )}
      {activeTab === 'playlist' && (
        <FlatList
          data={PLAYLISTS}
          keyExtractor={i => i.id}
          renderItem={renderPlaylistCell}
          numColumns={GRID_COLS}
          contentContainerStyle={styles.grid}
          showsVerticalScrollIndicator={false}
        />
      )}
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
    alignItems: 'baseline',
    paddingHorizontal: spacing.base,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  headerTitle: {
    ...typography.headlineSmall,
    color: colors.text,
    letterSpacing: 2,
  },
  headerSub: {
    ...typography.titleMedium,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
  },
  tabRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.base,
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  tabBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  tabBtnActive: {
    borderColor: colors.accent,
    backgroundColor: colors.accentContainer,
  },
  tabLabel: {
    ...typography.labelMedium,
    color: colors.textSecondary,
    letterSpacing: 1,
  },
  tabLabelActive: {
    color: colors.accent,
    fontWeight: '700',
  },
  grid: {
    padding: spacing.base,
    gap: spacing.sm,
  },
  cell: {
    width: CELL_SIZE,
    marginRight: spacing.sm,
    marginBottom: spacing.md,
  },
  coverWrap: {
    position: 'relative',
  },
  cellCover: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceVariant,
  },
  badgeOverlay: {
    position: 'absolute',
    bottom: 4,
    right: 4,
  },
  playlistCountBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: radius.xs,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  playlistCountText: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.text,
  },
  cellArtist: {
    ...typography.labelSmall,
    color: colors.textMuted,
    marginTop: 4,
  },
  cellTitle: {
    ...typography.labelSmall,
    color: colors.text,
    fontWeight: '600',
  },
});
