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
        text: 'Elimina',
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
          {item.name}
          {item.isSystem && ' ⭐'}
        </Text>
        <Text style={styles.plCount}>{item.tracks.length} brani</Text>
        {item.isPrivate && (
          <View style={styles.privBadge}>
            <Text style={styles.privText}>PRIVATA</Text>
          </View>
        )}
      </View>
      <TouchableOpacity
        onPress={() => handleDeletePlaylist(item)}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Text style={styles.moreBtn}>···</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (selectedPlaylist) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        {/* Playlist detail header */}
        <View style={styles.detailHeader}>
          <TouchableOpacity onPress={() => setSelectedPlaylist(null)} style={styles.backBtn}>
            <Text style={styles.backBtnText}>‹ Indietro</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              if (selectedPlaylist.tracks.length > 0) {
                play(selectedPlaylist.tracks[0], selectedPlaylist);
              }
            }}
            style={styles.playAllBtn}
          >
            <Text style={styles.playAllText}>▶ RIPRODUCI</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.detailCoverRow}>
          <Image source={{ uri: selectedPlaylist.cover }} style={styles.detailCover} />
          <View style={styles.detailMeta}>
            <Text style={styles.detailName}>{selectedPlaylist.name}</Text>
            <Text style={styles.detailCount}>{selectedPlaylist.tracks.length} brani</Text>
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
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>PLAYLIST</Text>
        <TouchableOpacity onPress={() => setCreateOpen(true)} style={styles.addBtn}>
          <Text style={styles.addBtnText}>＋</Text>
        </TouchableOpacity>
      </View>

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
            <Text style={styles.modalTitle}>Nuova Playlist</Text>

            <TextInput
              style={styles.input}
              placeholder="Nome playlist"
              placeholderTextColor={colors.textMuted}
              value={newName}
              onChangeText={setNewName}
              autoFocus
            />

            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Privata</Text>
              <Switch
                value={newPrivate}
                onValueChange={setNewPrivate}
                trackColor={{ false: colors.border, true: colors.accent }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={styles.modalBtns}>
              <TouchableOpacity
                onPress={() => setCreateOpen(false)}
                style={styles.modalCancelBtn}
              >
                <Text style={styles.modalCancelText}>Annulla</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleCreate} style={styles.modalCreateBtn}>
                <Text style={styles.modalCreateText}>Crea</Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  headerTitle: {
    ...typography.headlineSmall,
    color: colors.text,
    letterSpacing: 2,
  },
  addBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addBtnText: {
    fontSize: 20,
    color: '#FFF',
    lineHeight: 22,
  },
  listContent: { paddingBottom: spacing.xxxl },
  playlistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderFaint,
  },
  plCover: {
    width: 60,
    height: 60,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceVariant,
  },
  plInfo: {
    flex: 1,
    marginLeft: spacing.md,
    gap: 3,
  },
  plName: {
    ...typography.titleSmall,
    color: colors.text,
  },
  plCount: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  privBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.xs,
    backgroundColor: colors.surfaceVariant,
  },
  privText: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 0.5,
  },
  moreBtn: {
    color: colors.textMuted,
    fontSize: 18,
    paddingHorizontal: spacing.sm,
    letterSpacing: 1,
  },
  // Detail view
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  backBtn: { padding: spacing.xs },
  backBtnText: {
    ...typography.titleMedium,
    color: colors.accent,
  },
  playAllBtn: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: colors.accent,
  },
  playAllText: {
    ...typography.labelMedium,
    color: '#FFF',
    letterSpacing: 1,
  },
  detailCoverRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.base,
    gap: spacing.base,
  },
  detailCover: {
    width: 100,
    height: 100,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceVariant,
  },
  detailMeta: { flex: 1 },
  detailName: {
    ...typography.headlineSmall,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  detailCount: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
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
    ...typography.titleLarge,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: colors.surfaceVariant,
    borderRadius: radius.md,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    color: colors.text,
    ...typography.bodyLarge,
    borderWidth: 1,
    borderColor: colors.border,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  switchLabel: {
    ...typography.bodyLarge,
    color: colors.text,
  },
  modalBtns: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceVariant,
    alignItems: 'center',
  },
  modalCancelText: {
    ...typography.labelLarge,
    color: colors.textSecondary,
  },
  modalCreateBtn: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.accent,
    alignItems: 'center',
  },
  modalCreateText: {
    ...typography.labelLarge,
    color: '#FFF',
    fontWeight: '700',
  },
});
