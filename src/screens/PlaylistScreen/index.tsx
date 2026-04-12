import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  Modal,
  TextInput,
  Switch,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PLAYLISTS } from '../../data/mockData';
import { Playlist, SortCriteria } from '../../types';
import TrackCard from '../../components/TrackCard';
import SortFilterBar from '../../components/SortFilterBar';
import { usePlayerStore } from '../../store/playerStore';
import { colors, spacing, radius, typography } from '../../theme';
import ScreenHeader from '../../components/ScreenHeader';

export default function PlaylistScreen() {
  const insets = useSafeAreaInsets();
  const { play } = usePlayerStore();
  const [playlists, setPlaylists] = useState<Playlist[]>(PLAYLISTS);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const [sort, setSort] = useState<SortCriteria>('addedDesc');
  const [createOpen, setCreateOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPrivate, setNewPrivate] = useState(false);

  const handleCreate = () => {
    if (!newName.trim()) return;
    const pl: Playlist = {
      id: `pl_${Date.now()}`,
      name: newName.trim(),
      cover: `https://picsum.photos/seed/${Date.now()}/400`,
      tracks: [],
      isPrivate: newPrivate,
      isSystem: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ownerId: 'me',
    };
    setPlaylists(prev => [pl, ...prev]);
    setNewName('');
    setNewPrivate(false);
    setCreateOpen(false);
  };

  const handleDeletePlaylist = (pl: Playlist) => {
    if (pl.isSystem) {
      Alert.alert('Non eliminabile', 'Questa playlist di sistema non può essere eliminata.');
      return;
    }
    Alert.alert('Elimina playlist', `Vuoi eliminare "${pl.name}"?`, [
      { text: 'Annulla', style: 'cancel' },
      {
        text: 'ELIMINA',
        style: 'destructive',
        onPress: () => setPlaylists(prev => prev.filter(p => p.id !== pl.id)),
      },
    ]);
  };

  const renderPlaylist = ({ item }: { item: Playlist }) => (
    <TouchableOpacity
      style={styles.playlistItem}
      onPress={() => setSelectedPlaylist(item)}
      activeOpacity={0.75}
    >
      <Image source={{ uri: item.cover }} style={styles.plCover} />
      <View style={styles.plInfo}>
        <Text style={styles.plName} numberOfLines={1}>
          {item.name.toUpperCase()}{item.isSystem ? ' ★' : ''}
        </Text>
        <Text style={styles.plMeta}>
          {item.tracks.length} BRANI{item.isPrivate ? '  ·  PRIVATA' : ''}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => handleDeletePlaylist(item)}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Text style={styles.moreBtn}>···</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  // ─── Playlist detail view ──────────────────────────────────────────────────
  if (selectedPlaylist) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <ScreenHeader
          title={selectedPlaylist.name.toUpperCase()}
          rightLabel="‹ INDIETRO"
          onRightPress={() => setSelectedPlaylist(null)}
        />

        <View style={styles.detailCoverRow}>
          <Image source={{ uri: selectedPlaylist.cover }} style={styles.detailCover} />
          <View style={styles.detailMeta}>
            <Text style={styles.detailCount}>{selectedPlaylist.tracks.length} BRANI</Text>
            <TouchableOpacity
              onPress={() => {
                if (selectedPlaylist.tracks.length > 0) {
                  play(selectedPlaylist.tracks[0], selectedPlaylist);
                }
              }}
              style={styles.playAllBtn}
            >
              <Text style={styles.playAllText}>▶  RIPRODUCI TUTTO</Text>
            </TouchableOpacity>
          </View>
        </View>

        <SortFilterBar value={sort} onChange={setSort} />

        <FlatList
          data={selectedPlaylist.tracks}
          keyExtractor={t => t.id}
          renderItem={({ item }) => (
            <TrackCard
              track={item}
              showDuration
              onPress={() => play(item, selectedPlaylist)}
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: spacing.xxxl }}
        />
      </View>
    );
  }

  // ─── Playlist list view ────────────────────────────────────────────────────
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScreenHeader
        title="PLAYLIST"
        rightLabel="+ CREA"
        onRightPress={() => setCreateOpen(true)}
      />

      <SortFilterBar value={sort} onChange={setSort} />

      <FlatList
        data={playlists}
        keyExtractor={p => p.id}
        renderItem={renderPlaylist}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Create playlist modal */}
      <Modal visible={createOpen} transparent animationType="slide" onRequestClose={() => setCreateOpen(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>NUOVA PLAYLIST</Text>

            <TextInput
              style={styles.input}
              placeholder="NOME PLAYLIST"
              placeholderTextColor={colors.textMuted}
              value={newName}
              onChangeText={setNewName}
              autoFocus
              autoCapitalize="characters"
            />

            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>PRIVATA</Text>
              <Switch
                value={newPrivate}
                onValueChange={setNewPrivate}
                trackColor={{ false: '#2A2A2A', true: colors.accent }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={styles.modalBtns}>
              <TouchableOpacity
                onPress={() => setCreateOpen(false)}
                style={styles.modalCancelBtn}
              >
                <Text style={styles.modalCancelText}>ANNULLA</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleCreate} style={styles.modalCreateBtn}>
                <Text style={styles.modalCreateText}>CREA</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  listContent: { paddingBottom: spacing.xxxl },

  // Playlist row
  playlistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderFaint,
  },
  plCover: {
    width: 56,
    height: 56,
    borderRadius: radius.xs,
    backgroundColor: colors.surfaceVariant,
  },
  plInfo: {
    flex: 1,
    marginLeft: spacing.md,
    gap: 4,
  },
  plName: {
    fontSize: 15,
    fontWeight: '900',
    color: colors.text,
    letterSpacing: 0.5,
  },
  plMeta: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
    letterSpacing: 1,
  },
  moreBtn: {
    color: colors.textMuted,
    fontSize: 18,
    paddingHorizontal: spacing.sm,
    letterSpacing: 1,
  },

  // Detail view
  detailCoverRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.lg,
    gap: spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderFaint,
  },
  detailCover: {
    width: 90,
    height: 90,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceVariant,
  },
  detailMeta: { flex: 1, gap: spacing.sm },
  detailCount: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
    letterSpacing: 1.5,
  },
  playAllBtn: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: colors.accent,
  },
  playAllText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFF',
    letterSpacing: 1.5,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: colors.surfaceElevated,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: spacing.xl,
    gap: spacing.md,
    borderTopWidth: 1,
    borderColor: colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.text,
    letterSpacing: 2,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: colors.surfaceVariant,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
    borderWidth: 1,
    borderColor: colors.border,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.borderFaint,
  },
  switchLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: 1,
  },
  modalBtns: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceVariant,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 1.5,
  },
  modalCreateBtn: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: radius.sm,
    backgroundColor: colors.accent,
    alignItems: 'center',
  },
  modalCreateText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFF',
    letterSpacing: 1.5,
  },
});
