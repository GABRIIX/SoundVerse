import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TRACKS, ALBUMS, ARTISTS } from '../../data/mockData';
import TrackCard from '../../components/TrackCard';
import PlatformBadge from '../../components/PlatformBadge';
import { usePlayerStore } from '../../store/playerStore';
import { colors, spacing, radius, typography } from '../../theme';
import { Track, Album, Artist } from '../../types';

type SearchMode = 'search' | 'bot';

const GENRE_TAGS = ['rap', 'trap', 'drill', 'r&b', 'pop', 'afrobeat', 'reggaeton', 'soul', 'jazz', 'elettronica'];

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const { play } = usePlayerStore();
  const [mode, setMode] = useState<SearchMode>('search');
  const [query, setQuery] = useState('');
  const [activeGenre, setActiveGenre] = useState<string | null>(null);

  const q = query.toLowerCase();
  const filteredTracks = TRACKS.filter(
    t =>
      (!q || t.title.toLowerCase().includes(q) || t.artist.name.toLowerCase().includes(q)) &&
      (!activeGenre || t.genre === activeGenre),
  );
  const filteredArtists = ARTISTS.filter(
    a => !q || a.name.toLowerCase().includes(q),
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>CERCA</Text>
        <TouchableOpacity
          style={styles.botToggle}
          onPress={() => setMode(m => (m === 'search' ? 'bot' : 'search'))}
        >
          <Text style={[styles.botToggleText, mode === 'bot' && { color: colors.accent }]}>
            {mode === 'bot' ? '🤖 BOT' : '🔍 CERCA'}
          </Text>
        </TouchableOpacity>
      </View>

      {mode === 'bot' ? (
        <VerseBotInline />
      ) : (
        <>
          {/* Search bar */}
          <View style={styles.searchBar}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Cerca artisti, brani, album..."
              placeholderTextColor={colors.textMuted}
              value={query}
              onChangeText={setQuery}
              returnKeyType="search"
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={() => setQuery('')}>
                <Text style={styles.clearBtn}>✕</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Genre filter chips */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.genreChips}
          >
            {GENRE_TAGS.map(g => (
              <TouchableOpacity
                key={g}
                style={[styles.genreChip, activeGenre === g && styles.genreChipActive]}
                onPress={() => setActiveGenre(prev => (prev === g ? null : g))}
              >
                <Text style={[styles.genreChipText, activeGenre === g && styles.genreChipTextActive]}>
                  {g.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.results}>
            {/* Artisti */}
            {filteredArtists.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>ARTISTI</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {filteredArtists.map(a => (
                    <TouchableOpacity key={a.id} style={styles.artistChip}>
                      <Text style={styles.artistChipText}>{a.name}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* Brani */}
            {filteredTracks.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>BRANI ({filteredTracks.length})</Text>
                {filteredTracks.map(t => (
                  <TrackCard
                    key={t.id}
                    track={t}
                    showDuration
                    onPress={() => play(t)}
                  />
                ))}
              </View>
            )}

            {filteredTracks.length === 0 && filteredArtists.length === 0 && query.length > 0 && (
              <View style={styles.empty}>
                <Text style={styles.emptyText}>Nessun risultato per "{query}"</Text>
              </View>
            )}
          </ScrollView>
        </>
      )}
    </View>
  );
}

function VerseBotInline() {
  return (
    <View style={styles.botPlaceholder}>
      <Text style={styles.botEmoji}>🤖</Text>
      <Text style={styles.botTitle}>VERSE AI</Text>
      <Text style={styles.botSub}>
        Chiedi di cercare brani, gestire la libreria o informazioni sugli artisti.
      </Text>
      <TouchableOpacity style={styles.botOpenBtn}>
        <Text style={styles.botOpenText}>Apri VERSE/BOT</Text>
      </TouchableOpacity>
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
  botToggle: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceVariant,
    borderWidth: 1,
    borderColor: colors.border,
  },
  botToggleText: {
    ...typography.labelMedium,
    color: colors.textSecondary,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.base,
    marginBottom: spacing.sm,
    backgroundColor: colors.surfaceVariant,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchIcon: { fontSize: 16, marginRight: spacing.sm },
  searchInput: {
    flex: 1,
    paddingVertical: spacing.md,
    color: colors.text,
    ...typography.bodyLarge,
  },
  clearBtn: {
    color: colors.textMuted,
    fontSize: 14,
    padding: spacing.xs,
  },
  genreChips: {
    paddingHorizontal: spacing.base,
    paddingBottom: spacing.sm,
    gap: spacing.sm,
    flexDirection: 'row',
  },
  genreChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: 'transparent',
  },
  genreChipActive: {
    backgroundColor: colors.accentContainer,
    borderColor: colors.accent,
  },
  genreChipText: {
    ...typography.labelSmall,
    color: colors.textSecondary,
    letterSpacing: 0.8,
  },
  genreChipTextActive: {
    color: colors.accent,
    fontWeight: '700',
  },
  results: {
    paddingBottom: spacing.xxxl,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.labelSmall,
    color: colors.textMuted,
    letterSpacing: 1.5,
    paddingHorizontal: spacing.base,
    marginBottom: spacing.sm,
  },
  artistChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceVariant,
    marginLeft: spacing.base,
    borderWidth: 1,
    borderColor: colors.border,
  },
  artistChipText: {
    ...typography.labelMedium,
    color: colors.text,
  },
  empty: {
    padding: spacing.xxxl,
    alignItems: 'center',
  },
  emptyText: {
    ...typography.bodyMedium,
    color: colors.textMuted,
    textAlign: 'center',
  },
  // Bot inline
  botPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxxl,
    gap: spacing.md,
  },
  botEmoji: { fontSize: 56, lineHeight: 64 },
  botTitle: {
    ...typography.headlineMedium,
    color: colors.text,
    letterSpacing: 3,
  },
  botSub: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  botOpenBtn: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.full,
    backgroundColor: colors.accent,
  },
  botOpenText: {
    ...typography.labelLarge,
    color: '#FFF',
    fontWeight: '700',
  },
});
