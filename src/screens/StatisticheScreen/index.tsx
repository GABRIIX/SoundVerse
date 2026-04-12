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
  { key: 'day', label: 'GIORNO' },
  { key: 'week', label: 'SETTIMANA' },
  { key: 'month', label: 'MESE' },
  { key: 'year', label: 'ANNO' },
  { key: 'range', label: 'INTERVALLO' },
];

function formatPeriodLabel(type: PeriodType, date: Date): string {
  const d = date.getDate();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const y = String(date.getFullYear()).slice(2);
  switch (type) {
    case 'day': return `${d}/${m}/${y}`;
    case 'week': return `SETT. ${d}/${m}`;
    case 'month': return `${m}/${y}`;
    case 'year': return String(date.getFullYear());
    case 'range': return `${d}/${m}–${d + 7}/${m}`;
    default: return '';
  }
}

function SectionHeader({ title }: { title: string }) {
  return <Text style={styles.sectionHeader}>{title}</Text>;
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
        <View style={styles.headerLeft}>
          <View style={styles.bullet} />
          <Text style={styles.headerTitle}>STATISTICHE</Text>
        </View>
        <TouchableOpacity onPress={() => setPickerOpen(true)} style={styles.dateBtn}>
          <Text style={styles.dateBtnText}>{periodLabel}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Minuti ascoltati */}
        <SectionHeader title="MINUTI ASCOLTATI" />
        <View style={styles.bigStatRow}>
          <Text style={styles.bigNumber}>{stats.minutesListened.toLocaleString('it-IT')}</Text>
          <Text style={styles.bigNumberSub}>≈ {Math.round(stats.minutesListened / 60)} ORE</Text>
        </View>

        {/* Genere più ascoltato */}
        <SectionHeader title="GENERE PIÙ ASCOLTATO" />
        <View style={styles.genreRow}>
          <Image source={{ uri: stats.topGenreCover }} style={styles.genreCover} />
          <Text style={styles.genreLabel}>{stats.topGenre.toUpperCase()}</Text>
        </View>

        {/* Artisti più ascoltati */}
        <SectionHeader title="ARTISTI PIÙ ASCOLTATI" />
        {stats.topArtists.map((item, i) => (
          <View key={item.artist.id} style={styles.rankRow}>
            <Text style={styles.rankNum}>{i + 1}</Text>
            <Image source={{ uri: item.artist.avatar }} style={styles.rankAvatar} />
            <Text style={styles.rankName} numberOfLines={1}>{item.artist.name.toUpperCase()}</Text>
            <Text style={styles.rankCount}>{item.playCount}×</Text>
          </View>
        ))}

        {/* Brani più ascoltati */}
        <SectionHeader title="BRANI PIÙ ASCOLTATI" />
        {stats.topTracks.map((item, i) => (
          <View key={item.track.id} style={styles.rankRow}>
            <Text style={styles.rankNum}>{i + 1}</Text>
            <Image source={{ uri: item.track.cover }} style={styles.rankCover} />
            <View style={styles.rankInfo}>
              <Text style={styles.rankName} numberOfLines={1}>{item.track.title.toUpperCase()}</Text>
              <Text style={styles.rankSub} numberOfLines={1}>{item.track.artist.name.toUpperCase()}</Text>
            </View>
            <Text style={styles.rankCount}>{item.playCount}×</Text>
          </View>
        ))}

        {/* Album più ascoltati */}
        <SectionHeader title="ALBUM PIÙ ASCOLTATI" />
        {stats.topAlbums.map((item, i) => (
          <View key={item.album.id} style={styles.rankRow}>
            <Text style={styles.rankNum}>{i + 1}</Text>
            <Image source={{ uri: item.album.cover }} style={styles.rankCover} />
            <View style={styles.rankInfo}>
              <Text style={styles.rankName} numberOfLines={1}>{item.album.title.toUpperCase()}</Text>
              <Text style={styles.rankSub} numberOfLines={1}>{item.album.artist.name.toUpperCase()}</Text>
            </View>
            <Text style={styles.rankCount}>{item.playCount}×</Text>
          </View>
        ))}

        {/* Playlist più ascoltate */}
        <SectionHeader title="PLAYLIST PIÙ ASCOLTATE" />
        {stats.topPlaylists.map((item, i) => (
          <View key={item.playlist.id} style={[styles.rankRow, i === stats.topPlaylists.length - 1 && { marginBottom: spacing.xxxl }]}>
            <Text style={styles.rankNum}>{i + 1}</Text>
            <Image source={{ uri: item.playlist.cover }} style={styles.rankCover} />
            <View style={styles.rankInfo}>
              <Text style={styles.rankName} numberOfLines={1}>{item.playlist.name.toUpperCase()}</Text>
              <Text style={styles.rankSub} numberOfLines={1}>{item.playlist.tracks.length} BRANI</Text>
            </View>
            <Text style={styles.rankCount}>{item.playCount}×</Text>
          </View>
        ))}

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
            <Text style={styles.pickerTitle}>SELEZIONA PERIODO</Text>
            {PERIOD_OPTIONS.map(opt => (
              <TouchableOpacity
                key={opt.key}
                style={[styles.pickerOption, periodType === opt.key && styles.pickerOptionActive]}
                onPress={() => { setPeriodType(opt.key); setPickerOpen(false); }}
              >
                <Text style={[styles.pickerOptionText, periodType === opt.key && styles.pickerOptionTextActive]}>
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
  dateBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.borderFaint,
  },
  dateBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.accent,
    letterSpacing: 1,
  },
  content: {
    paddingBottom: spacing.xxxl,
  },
  sectionHeader: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 2,
    color: '#555555',
    textTransform: 'uppercase',
    paddingHorizontal: spacing.base,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  bigStatRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderFaint,
    gap: spacing.md,
  },
  bigNumber: {
    fontSize: 48,
    fontWeight: '900',
    color: colors.text,
    lineHeight: 56,
    letterSpacing: -1,
  },
  bigNumberSub: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 1,
  },
  genreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderFaint,
    gap: spacing.base,
  },
  genreCover: {
    width: 52,
    height: 52,
    borderRadius: radius.xs,
    backgroundColor: colors.surfaceVariant,
  },
  genreLabel: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.accent,
    letterSpacing: 2,
  },
  rankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderFaint,
    gap: spacing.sm,
  },
  rankNum: {
    fontSize: 13,
    fontWeight: '900',
    color: colors.textMuted,
    width: 22,
    textAlign: 'center',
    letterSpacing: 0.5,
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
    fontSize: 13,
    fontWeight: '900',
    color: colors.text,
    letterSpacing: 0.3,
  },
  rankSub: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textSecondary,
    letterSpacing: 0.5,
    marginTop: 2,
  },
  rankCount: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 0.5,
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
    fontSize: 13,
    fontWeight: '900',
    color: colors.text,
    letterSpacing: 2,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  pickerOption: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.base,
    borderRadius: radius.sm,
  },
  pickerOptionActive: {
    backgroundColor: colors.accentContainer,
  },
  pickerOptionText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
    textAlign: 'center',
    letterSpacing: 1,
  },
  pickerOptionTextActive: {
    color: colors.accent,
  },
});
