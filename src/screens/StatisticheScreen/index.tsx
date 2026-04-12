import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  Image,
  StyleSheet,
} from 'react-native';
import { MOCK_STATS } from '../../data/mockData';
import { StatsPeriod } from '../../types';
import { colors, spacing, radius, typography } from '../../theme';

type PeriodType = 'day' | 'week' | 'month' | 'year' | 'range';

const PERIOD_OPTIONS: { key: PeriodType; label: string }[] = [
  { key: 'day', label: 'Giorno' },
  { key: 'week', label: 'Settimana' },
  { key: 'month', label: 'Mese' },
  { key: 'year', label: 'Anno' },
  { key: 'range', label: 'Intervallo' },
];

function formatPeriodLabel(type: PeriodType, date: Date): string {
  const d = date.getDate();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const y = String(date.getFullYear()).slice(2);
  switch (type) {
    case 'day': return `${d}/${m}/${y}`;
    case 'week': return `Sett. ${d}/${m}`;
    case 'month': return `${m}/${y}`;
    case 'year': return String(date.getFullYear());
    case 'range': return `${d}/${m}–${d + 7}/${m}`;
    default: return '';
  }
}

export default function StatisticheScreen() {
  const [periodType, setPeriodType] = useState<PeriodType>('month');
  const [pickerOpen, setPickerOpen] = useState(false);
  const today = new Date();
  const stats = MOCK_STATS;

  const periodLabel = formatPeriodLabel(periodType, today);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>STATISTICHE</Text>
        <TouchableOpacity onPress={() => setPickerOpen(true)} style={styles.dateBtn}>
          <Text style={styles.dateBtnText}>{periodLabel}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Minuti ascoltati */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>MINUTI ASCOLTATI</Text>
          <Text style={styles.bigNumber}>{stats.minutesListened.toLocaleString('it-IT')}</Text>
          <Text style={styles.cardSub}>
            ≈ {Math.round(stats.minutesListened / 60)} ore
          </Text>
        </View>

        {/* Genere più ascoltato */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>GENERE PIÙ ASCOLTATO</Text>
          <View style={styles.genreRow}>
            <Image source={{ uri: stats.topGenreCover }} style={styles.genreCover} />
            <View style={[styles.genreBadge, { backgroundColor: colors.accentContainer }]}>
              <Text style={[styles.genreLabel, { color: colors.accent }]}>
                {stats.topGenre.toUpperCase()}
              </Text>
            </View>
          </View>
        </View>

        {/* Artisti più ascoltati */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>ARTISTI PIÙ ASCOLTATI</Text>
          {stats.topArtists.map((item, i) => (
            <View key={item.artist.id} style={styles.rankRow}>
              <Text style={styles.rankNum}>{i + 1}</Text>
              <Image source={{ uri: item.artist.avatar }} style={styles.rankAvatar} />
              <Text style={styles.rankName}>{item.artist.name}</Text>
              <Text style={styles.rankCount}>{item.playCount} riproduzioni</Text>
            </View>
          ))}
        </View>

        {/* Brani più ascoltati */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>BRANI PIÙ ASCOLTATI</Text>
          {stats.topTracks.map((item, i) => (
            <View key={item.track.id} style={styles.rankRow}>
              <Text style={styles.rankNum}>{i + 1}</Text>
              <Image source={{ uri: item.track.cover }} style={styles.rankCover} />
              <View style={styles.rankInfo}>
                <Text style={styles.rankName}>{item.track.title}</Text>
                <Text style={styles.rankSub}>{item.track.artist.name}</Text>
              </View>
              <Text style={styles.rankCount}>{item.playCount}×</Text>
            </View>
          ))}
        </View>

        {/* Album più ascoltati */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>ALBUM PIÙ ASCOLTATI</Text>
          {stats.topAlbums.map((item, i) => (
            <View key={item.album.id} style={styles.rankRow}>
              <Text style={styles.rankNum}>{i + 1}</Text>
              <Image source={{ uri: item.album.cover }} style={styles.rankCover} />
              <View style={styles.rankInfo}>
                <Text style={styles.rankName}>{item.album.title}</Text>
                <Text style={styles.rankSub}>{item.album.artist.name}</Text>
              </View>
              <Text style={styles.rankCount}>{item.playCount}×</Text>
            </View>
          ))}
        </View>

        {/* Playlist più ascoltate */}
        <View style={[styles.card, { marginBottom: spacing.xxxl }]}>
          <Text style={styles.cardLabel}>PLAYLIST PIÙ ASCOLTATE</Text>
          {stats.topPlaylists.map((item, i) => (
            <View key={item.playlist.id} style={styles.rankRow}>
              <Text style={styles.rankNum}>{i + 1}</Text>
              <Image source={{ uri: item.playlist.cover }} style={styles.rankCover} />
              <View style={styles.rankInfo}>
                <Text style={styles.rankName}>{item.playlist.name}</Text>
                <Text style={styles.rankSub}>{item.playlist.tracks.length} brani</Text>
              </View>
              <Text style={styles.rankCount}>{item.playCount}×</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Period picker modal */}
      <Modal
        visible={pickerOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setPickerOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setPickerOpen(false)}
          activeOpacity={1}
        >
          <View style={styles.picker}>
            <Text style={styles.pickerTitle}>Seleziona periodo</Text>
            {PERIOD_OPTIONS.map(opt => (
              <TouchableOpacity
                key={opt.key}
                style={[styles.pickerOption, periodType === opt.key && styles.pickerOptionActive]}
                onPress={() => { setPeriodType(opt.key); setPickerOpen(false); }}
              >
                <Text
                  style={[
                    styles.pickerOptionText,
                    periodType === opt.key && styles.pickerOptionTextActive,
                  ]}
                >
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
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
  dateBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceVariant,
  },
  dateBtnText: {
    ...typography.labelMedium,
    color: colors.accent,
    fontWeight: '700',
  },
  content: {
    padding: spacing.base,
    gap: spacing.md,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardLabel: {
    ...typography.labelSmall,
    color: colors.textMuted,
    letterSpacing: 1.5,
    marginBottom: spacing.md,
  },
  bigNumber: {
    fontSize: 48,
    fontWeight: '800',
    color: colors.text,
    lineHeight: 56,
  },
  cardSub: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  genreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  genreCover: {
    width: 64,
    height: 64,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceVariant,
  },
  genreBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
  },
  genreLabel: {
    ...typography.titleMedium,
    letterSpacing: 2,
  },
  rankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    gap: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.borderFaint,
  },
  rankNum: {
    ...typography.headlineSmall,
    color: colors.textMuted,
    width: 28,
    textAlign: 'center',
  },
  rankAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceVariant,
  },
  rankCover: {
    width: 40,
    height: 40,
    borderRadius: radius.xs,
    backgroundColor: colors.surfaceVariant,
  },
  rankInfo: { flex: 1 },
  rankName: {
    ...typography.titleSmall,
    color: colors.text,
  },
  rankSub: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  rankCount: {
    ...typography.labelSmall,
    color: colors.textMuted,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  picker: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.xl,
    padding: spacing.xl,
    width: 280,
    gap: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pickerTitle: {
    ...typography.titleMedium,
    color: colors.text,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  pickerOption: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.base,
    borderRadius: radius.md,
  },
  pickerOptionActive: {
    backgroundColor: colors.accentContainer,
  },
  pickerOptionText: {
    ...typography.bodyLarge,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  pickerOptionTextActive: {
    color: colors.accent,
    fontWeight: '600',
  },
});
