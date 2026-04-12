import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CURRENT_USER, NEWS_ARTICLES, formatNumber } from '../../data/mockData';
import { colors, spacing, radius, typography } from '../../theme';
import ScreenHeader from '../../components/ScreenHeader';

type ProfileTab = 'profilo' | 'amici' | 'notizie' | 'giochi' | 'bot';

const TABS: { key: ProfileTab; label: string }[] = [
  { key: 'profilo', label: 'PROFILO' },
  { key: 'amici', label: 'AMICI' },
  { key: 'notizie', label: 'NOTIZIE' },
  { key: 'giochi', label: 'GIOCHI' },
  { key: 'bot', label: 'VERSE AI' },
];

// ─── Row helpers (same style as Settings) ────────────────────────────────────

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

function SectionHeader({ title }: { title: string }) {
  return <Text style={styles.sectionHeader}>{title}</Text>;
}

// ─── Main screen ──────────────────────────────────────────────────────────────

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<ProfileTab>('profilo');
  const [user, setUser] = useState(CURRENT_USER);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScreenHeader title="PROFILO" />

      {/* Tab bar */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabScroll}
        contentContainerStyle={styles.tabContent}
      >
        {TABS.map(tab => (
          <TouchableOpacity
            key={tab.key}
            style={styles.tabBtn}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text style={[styles.tabLabel, activeTab === tab.key && styles.tabLabelActive]}>
              {tab.label}
            </Text>
            {activeTab === tab.key && <View style={styles.tabUnderline} />}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Content */}
      {activeTab === 'profilo' && (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Avatar + nickname hero */}
          <View style={styles.hero}>
            <TouchableOpacity style={styles.avatarWrap}>
              <Image source={{ uri: user.avatar }} style={styles.avatar} />
              <View style={styles.avatarEdit}>
                <Text style={styles.avatarEditIcon}>✎</Text>
              </View>
            </TouchableOpacity>
            <View style={styles.heroInfo}>
              <Text style={styles.nickname}>{user.nickname.toUpperCase()}</Text>
              <Text style={styles.realName}>{user.realName}</Text>
            </View>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{formatNumber(user.followersCount)}</Text>
                <Text style={styles.statLabel}>FOLLOWER</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{formatNumber(user.totalPlays)}</Text>
                <Text style={styles.statLabel}>RIPRODUZIONI</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{formatNumber(user.totalLikes)}</Text>
                <Text style={styles.statLabel}>MI PIACE</Text>
              </View>
            </View>
          </View>

          {/* Dati account */}
          <SectionHeader title="DATI ACCOUNT" />
          <EditableRow
            label="NICKNAME"
            value={user.nickname.toUpperCase()}
            onSubmit={v => setUser(u => ({ ...u, nickname: v }))}
          />
          <EditableRow
            label="NOME REALE"
            value={user.realName}
            onSubmit={v => setUser(u => ({ ...u, realName: v }))}
          />
          <EditableRow
            label="EMAIL"
            value={user.email}
            onSubmit={v => setUser(u => ({ ...u, email: v }))}
            keyboardType="email-address"
          />

          {/* Piattaforme */}
          <SectionHeader title="PIATTAFORME COLLEGATE" />
          {(['spotify', 'youtube', 'soundcloud', 'appleMusic'] as const).map(p => (
            <View key={p} style={styles.row}>
              <Text style={styles.rowLabel}>{p.toUpperCase()}</Text>
              <Text style={[
                styles.rowValue,
                user.connectedPlatforms[p] && { color: colors.success },
              ]}>
                {user.connectedPlatforms[p] ? 'CONNESSO' : 'CONNETTI'}
              </Text>
            </View>
          ))}

          <TouchableOpacity style={[styles.row, { marginBottom: spacing.xxxl }]}>
            <Text style={[styles.rowLabel, { color: colors.error }]}>DISCONNETTI ACCOUNT</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {activeTab === 'amici' && (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <SectionHeader title={`AMICI (${user.friends.length})`} />
          {user.friends.map(friend => (
            <View key={friend.id} style={styles.row}>
              <Image source={{ uri: friend.avatar }} style={styles.friendAvatar} />
              <View style={styles.friendInfo}>
                <Text style={styles.rowLabel}>{friend.nickname.toUpperCase()}</Text>
                <Text style={styles.rowValue}>{friend.realName}</Text>
              </View>
              <TouchableOpacity style={styles.chatBtn}>
                <Text style={styles.chatBtnText}>›</Text>
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity style={styles.addFriendBtn}>
            <Text style={styles.addFriendText}>+ CERCA AMICI</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {activeTab === 'notizie' && (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <SectionHeader title="NOTIZIE MUSICALI" />
          {NEWS_ARTICLES.map(article => (
            <TouchableOpacity key={article.id} style={styles.articleRow} activeOpacity={0.75}>
              <View style={styles.articleBody}>
                <Text style={styles.articleSource}>{article.source.toUpperCase()}</Text>
                <Text style={styles.articleTitle} numberOfLines={2}>{article.title}</Text>
              </View>
              {article.imageUrl && (
                <Image source={{ uri: article.imageUrl }} style={styles.articleThumb} />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {activeTab === 'giochi' && <GamesSection />}

      {activeTab === 'bot' && <VerseBotScreen />}
    </View>
  );
}

// ─── Editable row ─────────────────────────────────────────────────────────────

function EditableRow({
  label,
  value,
  onSubmit,
  keyboardType = 'default',
}: {
  label: string;
  value: string;
  onSubmit: (v: string) => void;
  keyboardType?: 'default' | 'email-address';
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  if (editing) {
    return (
      <View style={[styles.row, { backgroundColor: colors.surface }]}>
        <Text style={styles.rowLabel}>{label}</Text>
        <TextInput
          style={styles.editInput}
          value={draft}
          onChangeText={setDraft}
          onBlur={() => { onSubmit(draft); setEditing(false); }}
          onSubmitEditing={() => { onSubmit(draft); setEditing(false); }}
          autoFocus
          keyboardType={keyboardType}
          returnKeyType="done"
          placeholderTextColor={colors.textMuted}
        />
      </View>
    );
  }

  return (
    <TouchableOpacity style={styles.row} onPress={() => setEditing(true)} activeOpacity={0.6}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </TouchableOpacity>
  );
}

// ─── Games section ────────────────────────────────────────────────────────────

function GamesSection() {
  const GAMES = [
    { id: 'g1', title: 'INDOVINA LA CANZONE', desc: 'Ascolta l\'intro e indovina il brano', icon: '♪' },
    { id: 'g2', title: 'QUALE È PIÙ FAMOSA?', desc: 'Confronta due tracce per stream', icon: '◉' },
    { id: 'g3', title: 'INDOVINA IL FEAT', desc: 'Chi è il featuring dal solo audio?', icon: '◎' },
  ];
  return (
    <ScrollView contentContainerStyle={{ paddingBottom: spacing.xxxl }} showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionHeader}>GIOCHI MUSICALI</Text>
      {GAMES.map(g => (
        <TouchableOpacity key={g.id} style={styles.row} activeOpacity={0.75}>
          <View style={{ flex: 1 }}>
            <Text style={styles.rowLabel}>{g.title}</Text>
            <Text style={[styles.rowValue, { marginTop: 2 }]}>{g.desc}</Text>
          </View>
          <Text style={styles.rowValue}>{g.icon}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

// ─── VERSE BOT ────────────────────────────────────────────────────────────────

function VerseBotScreen() {
  const [messages, setMessages] = useState([
    { id: 'm0', from: 'bot', text: 'Ciao! Sono VERSE, il tuo assistente musicale. Chiedi pure!' },
  ]);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    const txt = input.trim();
    if (!txt) return;
    const userMsg = { id: `u_${Date.now()}`, from: 'user', text: txt };
    const botReply = { id: `b_${Date.now()}`, from: 'bot', text: `Sto elaborando: "${txt}". Funzionalità AI in arrivo!` };
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
          placeholder="Scrivi a VERSE..."
          placeholderTextColor={colors.textMuted}
          value={input}
          onChangeText={setInput}
          onSubmitEditing={sendMessage}
          returnKeyType="send"
        />
        <TouchableOpacity onPress={sendMessage} style={botStyles.sendBtn}>
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
    maxWidth: '80%',
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
    letterSpacing: 0.3,
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

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  // Tabs
  tabScroll: { flexGrow: 0 },
  tabContent: {
    paddingHorizontal: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabBtn: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    paddingTop: spacing.xs,
    position: 'relative',
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: colors.textSecondary,
  },
  tabLabelActive: { color: colors.text },
  tabUnderline: {
    position: 'absolute',
    bottom: 0,
    left: spacing.md,
    right: spacing.md,
    height: 2,
    backgroundColor: colors.accent,
  },

  // Shared row style (mirrors SettingsScreen)
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    paddingVertical: 13,
    borderTopWidth: 1,
    borderTopColor: colors.borderFaint,
  },
  rowLabel: {
    ...typography.rowLabel,
    flex: 1,
  },
  rowValue: {
    ...typography.rowValue,
    flexShrink: 0,
    marginLeft: spacing.md,
  },

  // Section header
  sectionHeader: {
    ...typography.sectionLabel,
    paddingHorizontal: spacing.base,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },

  // Edit input in row
  editInput: {
    flex: 1,
    color: colors.text,
    fontSize: 14,
    textAlign: 'right',
    borderBottomWidth: 1,
    borderBottomColor: colors.accent,
    paddingVertical: 2,
    marginLeft: spacing.md,
  },

  // Hero (avatar + nickname + stats)
  hero: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.base,
    gap: spacing.md,
  },
  avatarWrap: { position: 'relative' },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.surfaceVariant,
  },
  avatarEdit: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.accent,
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarEditIcon: { fontSize: 13, color: '#FFF' },
  heroInfo: { alignItems: 'center', gap: 3 },
  nickname: {
    fontSize: 26,
    fontWeight: '900',
    color: colors.text,
    letterSpacing: 2,
  },
  realName: {
    fontSize: 12,
    fontWeight: '400',
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    marginTop: spacing.sm,
  },
  statItem: { alignItems: 'center', gap: 2 },
  statValue: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.text,
    letterSpacing: 0.5,
  },
  statLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: colors.textSecondary,
    letterSpacing: 1.5,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: colors.borderFaint,
  },

  // Content scroll
  content: { paddingBottom: spacing.xxxl },

  // Friends
  friendAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceVariant,
    marginRight: spacing.md,
  },
  friendInfo: { flex: 1 },
  chatBtn: { padding: spacing.sm },
  chatBtnText: { fontSize: 22, color: colors.textSecondary },
  addFriendBtn: {
    marginHorizontal: spacing.base,
    marginTop: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.accent,
    alignItems: 'center',
  },
  addFriendText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.accent,
    letterSpacing: 2,
  },

  // News
  articleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderFaint,
    gap: spacing.md,
  },
  articleBody: { flex: 1 },
  articleSource: {
    fontSize: 9,
    fontWeight: '600',
    color: colors.textSecondary,
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  articleTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: colors.text,
    letterSpacing: 0.3,
  },
  articleThumb: {
    width: 64,
    height: 64,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceVariant,
  },
});
