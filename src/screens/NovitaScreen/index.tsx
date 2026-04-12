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

  const renderTrackCell = ({ item }: { item: typeof TRACKS[0] }) => (
    <TouchableOpacity style={styles.cell} onPress={() => play(item)} activeOpacity={0.75}>
      <View style={styles.coverWrap}>
        <Image source={{ uri: item.cover }} style={styles.cellCover} />
        <View style={styles.badgeOverlay}>
          <PlatformBadge platform={item.platform} size="sm" />
        </View>
      </View>
      <Text style={styles.cellArtist} numberOfLines={1}>{item.artist.name.toUpperCase()}</Text>
      <Text style={styles.cellTitle} numberOfLines={1}>{item.title.toUpperCase()}</Text>
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
      <Text style={styles.cellArtist} numberOfLines={1}>{item.artist.name.toUpperCase()}</Text>
      <Text style={styles.cellTitle} numberOfLines={1}>{item.title.toUpperCase()}</Text>
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
      <Text style={styles.cellTitle} numberOfLines={1}>{item.name.toUpperCase()}</Text>
    </TouchableOpacity>
  );

  const data = activeTab === 'canzoni' ? TRACKS : activeTab === 'album' ? ALBUMS : PLAYLISTS;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.bullet} />
          <Text style={styles.headerTitle}>NOVITÀ</Text>
        </View>
        <Text style={styles.headerSub}>{TABS.find(t => t.key === activeTab)?.label}</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        {TABS.map(tab => (
          <TouchableOpacity
            key={tab.key}
            onPress={() => setActiveTab(tab.key)}
            style={styles.tabBtn}
          >
            <Text style={[styles.tabLabel, activeTab === tab.key && styles.tabLabelActive]}>
              {tab.label}
            </Text>
            {activeTab === tab.key && <View style={styles.tabUnderline} />}
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
    alignItems: 'center',
    justifyContent: 'space-between',
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
  headerSub: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
    letterSpacing: 1.5,
  },
  tabRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.base,
    gap: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderFaint,
  },
  tabBtn: {
    paddingBottom: spacing.sm,
    paddingTop: spacing.xs,
    position: 'relative',
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 1.5,
  },
  tabLabelActive: { color: colors.text },
  tabUnderline: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: colors.accent,
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
    borderRadius: radius.xs,
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
    fontSize: 9,
    fontWeight: '600',
    color: colors.textSecondary,
    letterSpacing: 0.5,
    marginTop: 4,
  },
  cellTitle: {
    fontSize: 9,
    fontWeight: '900',
    color: colors.text,
    letterSpacing: 0.3,
  },
});
