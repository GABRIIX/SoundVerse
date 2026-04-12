import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import TrackCard from '../../components/TrackCard';
import { usePlayerStore } from '../../store/playerStore';
import { colors, spacing, radius, typography } from '../../theme';
import ScreenHeader from '../../components/ScreenHeader';
import {
  searchMusic,
  SearchPlatform,
  SearchResults,
} from '../../services/musicSearchService';
import { Track, Artist } from '../../types';

type SearchMode = 'search' | 'bot';

const GENRE_TAGS = ['rap', 'trap', 'drill', 'r&b', 'pop', 'afrobeat', 'reggaeton', 'soul', 'jazz', 'elettronica'];

const PLATFORMS: { key: SearchPlatform; label: string; color: string }[] = [
  { key: 'all',        label: 'TUTTE',      color: colors.accent },
  { key: 'youtube',    label: 'YOUTUBE',    color: '#FF0000' },
  { key: 'spotify',    label: 'SPOTIFY',    color: '#1DB954' },
  { key: 'soundcloud', label: 'SOUNDCLOUD', color: '#FF5500' },
];

const EMPTY_RESULTS: SearchResults = { tracks: [], artists: [], albums: [] };

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const { play } = usePlayerStore();

  const [mode, setMode] = useState<SearchMode>('search');
  const [query, setQuery] = useState('');
  const [activeGenre, setActiveGenre] = useState<string | null>(null);
  const [activePlatform, setActivePlatform] = useState<SearchPlatform>('all');
  const [results, setResults] = useState<SearchResults>(EMPTY_RESULTS);
  const [isLoading, setIsLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounced search — fires 500 ms after last keystroke
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!query.trim()) {
      setResults(EMPTY_RESULTS);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await searchMusic(query, activePlatform);
        // Apply genre filter client-side after fetching
        setResults({
          tracks: activeGenre
            ? res.tracks.filter(t => t.genre === activeGenre)
            : res.tracks,
          artists: res.artists,
          albums: res.albums,
        });
      } catch (err) {
        console.error('[SearchScreen] search error:', err);
        setResults(EMPTY_RESULTS);
      } finally {
        setIsLoading(false);
      }
    }, 500);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, activePlatform, activeGenre]);

  const hasResults =
    results.tracks.length > 0 || results.artists.length > 0;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScreenHeader
        title="CERCA"
        rightLabel={mode === 'bot' ? 'RICERCA' : 'VERSE AI'}
        onRightPress={() => setMode(m => (m === 'search' ? 'bot' : 'search'))}
      />

      {mode === 'bot' ? (
        <VerseBotInline />
      ) : (
        <>
          {/* ── Search bar ── */}
          <View style={styles.searchBar}>
            <Text style={styles.searchIcon}>◎</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="ARTISTI, BRANI, ALBUM..."
              placeholderTextColor={colors.textMuted}
              value={query}
              onChangeText={setQuery}
              returnKeyType="search"
              autoCapitalize="none"
            />
            {isLoading ? (
              <ActivityIndicator size="small" color={colors.accent} style={{ marginLeft: spacing.xs }} />
            ) : query.length > 0 ? (
              <TouchableOpacity
                onPress={() => setQuery('')}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text style={styles.clearBtn}>✕</Text>
              </TouchableOpacity>
            ) : null}
          </View>

          {/* ── Platform filter ── */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chips}
          >
            {PLATFORMS.map(p => {
              const isActive = activePlatform === p.key;
              return (
                <TouchableOpacity
                  key={p.key}
                  style={[
                    styles.platformChip,
                    isActive && { backgroundColor: p.color + '25', borderColor: p.color },
                  ]}
                  onPress={() => setActivePlatform(p.key)}
                >
                  <Text
                    style={[
                      styles.platformChipText,
                      isActive && { color: p.color },
                    ]}
                  >
                    {p.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* ── Genre filter chips ── */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chips}
          >
            {GENRE_TAGS.map(g => (
              <TouchableOpacity
                key={g}
                style={[styles.genreChip, activeGenre === g && styles.genreChipActive]}
                onPress={() => setActiveGenre(prev => (prev === g ? null : g))}
              >
                <Text
                  style={[
                    styles.genreChipText,
                    activeGenre === g && styles.genreChipTextActive,
                  ]}
                >
                  {g.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* ── Results ── */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.results}
            keyboardShouldPersistTaps="handled"
          >
            {/* Artists */}
            {results.artists.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  ARTISTI ({results.artists.length})
                </Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.artistRow}
                >
                  {results.artists.map(a => (
                    <ArtistChip key={a.id} artist={a} />
                  ))}
                </ScrollView>
              </View>
            )}

            {/* Tracks */}
            {results.tracks.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  BRANI ({results.tracks.length})
                </Text>
                {results.tracks.map(t => (
                  <TrackCard
                    key={t.id}
                    track={t}
                    showDuration
                    onPress={() => play(t)}
                  />
                ))}
              </View>
            )}

            {/* Empty state */}
            {!isLoading && query.length > 0 && !hasResults && (
              <View style={styles.empty}>
                <Text style={styles.emptyText}>
                  NESSUN RISULTATO{'\n'}PER "{query.toUpperCase()}"
                </Text>
              </View>
            )}

            {/* Prompt when nothing typed */}
            {!query.trim() && (
              <View style={styles.empty}>
                <Text style={styles.emptyText}>CERCA SU{'\n'}YOUTUBE · SPOTIFY · SOUNDCLOUD</Text>
              </View>
            )}
          </ScrollView>
        </>
      )}
    </View>
  );
}

// ── ArtistChip ────────────────────────────────────────────────────────────────

function ArtistChip({ artist }: { artist: Artist }) {
  return (
    <TouchableOpacity style={artistStyles.chip}>
      {artist.avatar ? (
        <Image source={{ uri: artist.avatar }} style={artistStyles.avatar} />
      ) : (
        <View style={[artistStyles.avatar, artistStyles.avatarPlaceholder]} />
      )}
      <Text style={artistStyles.name} numberOfLines={1}>
        {artist.name.toUpperCase()}
      </Text>
      {artist.verified && <Text style={artistStyles.verified}>✓</Text>}
    </TouchableOpacity>
  );
}

const artistStyles = StyleSheet.create({
  chip: {
    alignItems: 'center',
    width: 72,
    marginRight: spacing.md,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.surfaceVariant,
    marginBottom: spacing.xs,
  },
  avatarPlaceholder: {
    backgroundColor: colors.surfaceVariant,
  },
  name: {
    fontSize: 8,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: 0.3,
    textAlign: 'center',
  },
  verified: {
    fontSize: 9,
    color: colors.accent,
    marginTop: 1,
  },
});

// ── VerseBotInline ────────────────────────────────────────────────────────────

function VerseBotInline() {
  const [messages, setMessages] = useState([
    { id: 'm0', from: 'bot', text: 'Ciao! Sono VERSE. Dimmi cosa cerchi.' },
  ]);
  const [input, setInput] = useState('');

  const send = () => {
    const txt = input.trim();
    if (!txt) return;
    const userMsg = { id: `u_${Date.now()}`, from: 'user', text: txt };
    const botReply = {
      id: `b_${Date.now()}`,
      from: 'bot',
      text: `Cerco "${txt}"… Funzionalità AI in arrivo!`,
    };
    setMessages(prev => [...prev, userMsg, botReply]);
    setInput('');
  };

  return (
    <View style={botStyles.container}>
      <ScrollView
        contentContainerStyle={botStyles.messages}
        showsVerticalScrollIndicator={false}
      >
        {messages.map(m => (
          <View
            key={m.id}
            style={[
              botStyles.bubble,
              m.from === 'user' ? botStyles.userBubble : botStyles.botBubble,
            ]}
          >
            <Text style={[botStyles.bubbleText, m.from === 'user' && botStyles.userText]}>
              {m.text}
            </Text>
          </View>
        ))}
      </ScrollView>
      <View style={botStyles.inputRow}>
        <TextInput
          style={botStyles.input}
          placeholder="Chiedi a VERSE..."
          placeholderTextColor={colors.textMuted}
          value={input}
          onChangeText={setInput}
          onSubmitEditing={send}
          returnKeyType="send"
        />
        <TouchableOpacity onPress={send} style={botStyles.sendBtn}>
          <Text style={botStyles.sendText}>›</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const botStyles = StyleSheet.create({
  container: { flex: 1 },
  messages: { padding: spacing.base, gap: spacing.sm, paddingBottom: spacing.xl },
  bubble: {
    maxWidth: '82%',
    padding: spacing.md,
    borderRadius: radius.lg,
    marginVertical: 2,
  },
  botBubble: {
    backgroundColor: colors.surfaceVariant,
    alignSelf: 'flex-start',
    borderBottomLeftRadius: radius.xs,
  },
  userBubble: {
    backgroundColor: colors.accent,
    alignSelf: 'flex-end',
    borderBottomRightRadius: radius.xs,
  },
  bubbleText: { ...typography.bodyMedium, color: colors.text },
  userText: { color: '#FFF' },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    gap: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.borderFaint,
    backgroundColor: colors.background,
  },
  input: {
    flex: 1,
    backgroundColor: colors.surfaceVariant,
    borderRadius: radius.full,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    color: colors.text,
    fontSize: 14,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendText: { color: '#FFF', fontSize: 24, lineHeight: 28 },
});

// ── Main styles ───────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.base,
    marginBottom: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderFaint,
  },
  searchIcon: {
    fontSize: 16,
    color: colors.textMuted,
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    paddingVertical: spacing.md,
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  clearBtn: {
    color: colors.textMuted,
    fontSize: 13,
    padding: spacing.xs,
  },

  chips: {
    paddingHorizontal: spacing.base,
    paddingBottom: spacing.sm,
    gap: spacing.sm,
    flexDirection: 'row',
  },
  platformChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.borderFaint,
  },
  platformChipText: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 1,
  },
  genreChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.borderFaint,
  },
  genreChipActive: {
    backgroundColor: colors.accentContainer,
    borderColor: colors.accent,
  },
  genreChipText: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 1,
  },
  genreChipTextActive: { color: colors.accent },

  results: { paddingBottom: spacing.xxxl },
  section: { marginBottom: spacing.lg },
  sectionTitle: {
    fontSize: 9,
    fontWeight: '600',
    color: colors.textSecondary,
    letterSpacing: 2,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.borderFaint,
  },
  artistRow: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.sm,
  },

  empty: { padding: spacing.xxxl, alignItems: 'center' },
  emptyText: {
    fontSize: 13,
    fontWeight: '900',
    color: colors.textMuted,
    textAlign: 'center',
    letterSpacing: 1,
    lineHeight: 20,
  },
});
