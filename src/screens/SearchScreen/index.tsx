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
import { usePlayerStore } from '../../store/playerStore';
import { colors, spacing, radius, typography } from '../../theme';
import ScreenHeader from '../../components/ScreenHeader';

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
      <ScreenHeader
        title="CERCA"
        rightLabel={mode === 'bot' ? 'RICERCA' : 'VERSE AI'}
        onRightPress={() => setMode(m => (m === 'search' ? 'bot' : 'search'))}
      />

      {mode === 'bot' ? (
        <VerseBotInline />
      ) : (
        <>
          {/* Search bar */}
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
            {query.length > 0 && (
              <TouchableOpacity onPress={() => setQuery('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
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
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.artistChips}>
                  {filteredArtists.map(a => (
                    <TouchableOpacity key={a.id} style={styles.artistChip}>
                      <Text style={styles.artistChipText}>{a.name.toUpperCase()}</Text>
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
                <Text style={styles.emptyText}>NESSUN RISULTATO{'\n'}PER "{query.toUpperCase()}"</Text>
              </View>
            )}
          </ScrollView>
        </>
      )}
    </View>
  );
}

function VerseBotInline() {
  const [messages, setMessages] = useState([
    { id: 'm0', from: 'bot', text: 'Ciao! Sono VERSE. Dimmi cosa cerchi.' },
  ]);
  const [input, setInput] = useState('');

  const send = () => {
    const txt = input.trim();
    if (!txt) return;
    const userMsg = { id: `u_${Date.now()}`, from: 'user', text: txt };
    const botReply = { id: `b_${Date.now()}`, from: 'bot', text: `Cerco "${txt}"… Funzionalità AI in arrivo!` };
    setMessages(prev => [...prev, userMsg, botReply]);
    setInput('');
  };

  return (
    <View style={botStyles.container}>
      <ScrollView contentContainerStyle={botStyles.messages} showsVerticalScrollIndicator={false}>
        {messages.map(m => (
          <View key={m.id} style={[botStyles.bubble, m.from === 'user' ? botStyles.userBubble : botStyles.botBubble]}>
            <Text style={[botStyles.bubbleText, m.from === 'user' && botStyles.userText]}>{m.text}</Text>
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  // Search bar
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

  // Genre chips
  genreChips: {
    paddingHorizontal: spacing.base,
    paddingBottom: spacing.sm,
    gap: spacing.sm,
    flexDirection: 'row',
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
  genreChipTextActive: {
    color: colors.accent,
  },

  // Results
  results: {
    paddingBottom: spacing.xxxl,
  },
  section: {
    marginBottom: spacing.lg,
  },
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

  // Artist chips
  artistChips: {
    paddingHorizontal: spacing.base,
    gap: spacing.sm,
    flexDirection: 'row',
  },
  artistChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderFaint,
    borderRadius: radius.sm,
  },
  artistChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: 0.5,
  },

  // Empty state
  empty: {
    padding: spacing.xxxl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 13,
    fontWeight: '900',
    color: colors.textMuted,
    textAlign: 'center',
    letterSpacing: 1,
    lineHeight: 20,
  },
});
