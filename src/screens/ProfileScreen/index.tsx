import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StyleSheet,
  FlatList,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CURRENT_USER, NEWS_ARTICLES } from '../../data/mockData';
import { colors, spacing, radius, typography } from '../../theme';

type ProfileTab = 'profilo' | 'amici' | 'notizie' | 'giochi' | 'bot';

const TABS: { key: ProfileTab; label: string; icon: string }[] = [
  { key: 'profilo', label: 'Profilo', icon: '👤' },
  { key: 'amici', label: 'Amici', icon: '💬' },
  { key: 'notizie', label: 'Notizie', icon: '📰' },
  { key: 'giochi', label: 'Giochi', icon: '🎮' },
  { key: 'bot', label: 'VERSE AI', icon: '🤖' },
];

const PLATFORM_ICONS: Record<string, string> = {
  spotify: '🟢',
  youtube: '🔴',
  soundcloud: '🟠',
  appleMusic: '🍎',
};

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<ProfileTab>('profilo');
  const [user, setUser] = useState(CURRENT_USER);
  const [editingNick, setEditingNick] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [editingEmail, setEditingEmail] = useState(false);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
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
            style={[styles.tabBtn, activeTab === tab.key && styles.tabBtnActive]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text style={styles.tabIcon}>{tab.icon}</Text>
            <Text style={[styles.tabLabel, activeTab === tab.key && styles.tabLabelActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Content */}
      {activeTab === 'profilo' && (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Avatar */}
          <View style={styles.avatarSection}>
            <TouchableOpacity style={styles.avatarWrap}>
              <Image source={{ uri: user.avatar }} style={styles.avatar} />
              <View style={styles.avatarEdit}>
                <Text style={styles.avatarEditIcon}>✏️</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Editable fields */}
          <View style={styles.fieldGroup}>
            <EditableField
              label="Nickname"
              value={user.nickname}
              isEditing={editingNick}
              onEdit={() => setEditingNick(true)}
              onSubmit={(v) => { setUser(u => ({ ...u, nickname: v })); setEditingNick(false); }}
            />
            <EditableField
              label="Nome reale"
              value={user.realName}
              isEditing={editingName}
              onEdit={() => setEditingName(true)}
              onSubmit={(v) => { setUser(u => ({ ...u, realName: v })); setEditingName(false); }}
            />
            <EditableField
              label="Email"
              value={user.email}
              isEditing={editingEmail}
              onEdit={() => setEditingEmail(true)}
              onSubmit={(v) => { setUser(u => ({ ...u, email: v })); setEditingEmail(false); }}
              keyboardType="email-address"
            />
          </View>

          {/* Piattaforme collegate */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>PIATTAFORME COLLEGATE</Text>
            {(['spotify', 'youtube', 'soundcloud', 'appleMusic'] as const).map(p => (
              <View key={p} style={styles.platformRow}>
                <Text style={styles.platformIcon}>{PLATFORM_ICONS[p]}</Text>
                <Text style={styles.platformName}>{p.toUpperCase()}</Text>
                <View
                  style={[
                    styles.platformStatus,
                    user.connectedPlatforms[p] ? styles.statusConnected : styles.statusDisconnected,
                  ]}
                >
                  <Text style={styles.platformStatusText}>
                    {user.connectedPlatforms[p] ? 'CONNESSO' : 'CONNETTI'}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      )}

      {activeTab === 'amici' && (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionHeader}>AMICI ({user.friends.length})</Text>
          {user.friends.map(friend => (
            <View key={friend.id} style={styles.friendRow}>
              <Image source={{ uri: friend.avatar }} style={styles.friendAvatar} />
              <View style={styles.friendInfo}>
                <Text style={styles.friendNick}>{friend.nickname}</Text>
                <Text style={styles.friendName}>{friend.realName}</Text>
              </View>
              <TouchableOpacity style={styles.chatBtn}>
                <Text style={styles.chatBtnText}>💬</Text>
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity style={styles.addFriendBtn}>
            <Text style={styles.addFriendText}>＋ Cerca amici</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {activeTab === 'notizie' && (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionHeader}>NOTIZIE MUSICALI</Text>
          {NEWS_ARTICLES.map(article => (
            <View key={article.id} style={styles.articleCard}>
              {article.imageUrl && (
                <Image source={{ uri: article.imageUrl }} style={styles.articleImage} />
              )}
              <View style={styles.articleBody}>
                <Text style={styles.articleSource}>{article.source} · {article.publishedAt}</Text>
                <Text style={styles.articleTitle}>{article.title}</Text>
                <Text style={styles.articleSummary}>{article.summary}</Text>
                <TouchableOpacity>
                  <Text style={styles.articleReadMore}>Leggi di più ›</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      {activeTab === 'giochi' && <GamesSection />}

      {activeTab === 'bot' && <VerseBotScreen />}
    </View>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface EditableFieldProps {
  label: string;
  value: string;
  isEditing: boolean;
  onEdit: () => void;
  onSubmit: (value: string) => void;
  keyboardType?: 'default' | 'email-address';
}

function EditableField({ label, value, isEditing, onEdit, onSubmit, keyboardType = 'default' }: EditableFieldProps) {
  const [draft, setDraft] = useState(value);
  return (
    <View style={efStyles.row}>
      <Text style={efStyles.label}>{label}</Text>
      {isEditing ? (
        <TextInput
          style={efStyles.input}
          value={draft}
          onChangeText={setDraft}
          onBlur={() => onSubmit(draft)}
          onSubmitEditing={() => onSubmit(draft)}
          autoFocus
          keyboardType={keyboardType}
          returnKeyType="done"
        />
      ) : (
        <TouchableOpacity style={efStyles.valueRow} onPress={onEdit}>
          <Text style={efStyles.value}>{value}</Text>
          <Text style={efStyles.editIcon}>✏️</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const efStyles = StyleSheet.create({
  row: {
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderFaint,
  },
  label: {
    ...typography.labelSmall,
    color: colors.textMuted,
    letterSpacing: 1,
    marginBottom: 4,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  value: {
    ...typography.bodyLarge,
    color: colors.text,
  },
  editIcon: { fontSize: 14 },
  input: {
    ...typography.bodyLarge,
    color: colors.text,
    borderBottomWidth: 1,
    borderBottomColor: colors.accent,
    paddingVertical: 2,
  },
});

function GamesSection() {
  const GAMES = [
    { id: 'g1', title: 'Indovina la canzone', desc: 'Ascolta l\'intro e indovina il brano', icon: '🎵' },
    { id: 'g2', title: 'Quale è più famosa?', desc: 'Confronta due tracce per stream', icon: '📊' },
    { id: 'g3', title: 'Indovina il feat', desc: 'Chi è il featuring dal solo audio?', icon: '🎤' },
  ];
  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionHeader}>GIOCHI MUSICALI</Text>
      {GAMES.map(g => (
        <TouchableOpacity key={g.id} style={styles.gameCard} activeOpacity={0.75}>
          <Text style={styles.gameIcon}>{g.icon}</Text>
          <View style={styles.gameInfo}>
            <Text style={styles.gameTitle}>{g.title}</Text>
            <Text style={styles.gameDesc}>{g.desc}</Text>
          </View>
          <Text style={styles.gameArrow}>›</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

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
          placeholder="Scrivi un messaggio..."
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
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
  input: {
    flex: 1,
    backgroundColor: colors.surfaceVariant,
    borderRadius: radius.full,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    color: colors.text,
    ...typography.bodyMedium,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendText: { color: '#FFF', fontSize: 22, lineHeight: 28 },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  tabScroll: { flexGrow: 0, borderBottomWidth: 1, borderBottomColor: colors.border },
  tabContent: {
    paddingHorizontal: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabBtnActive: { borderBottomColor: colors.accent },
  tabIcon: { fontSize: 16 },
  tabLabel: { ...typography.labelMedium, color: colors.textSecondary },
  tabLabelActive: { color: colors.accent, fontWeight: '700' },
  content: { padding: spacing.base, paddingBottom: spacing.xxxl, gap: spacing.md },
  avatarSection: { alignItems: 'center', paddingVertical: spacing.xl },
  avatarWrap: { position: 'relative' },
  avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: colors.surfaceVariant },
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
  avatarEditIcon: { fontSize: 12 },
  fieldGroup: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.base,
    borderWidth: 1,
    borderColor: colors.border,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitle: {
    ...typography.labelSmall,
    color: colors.textMuted,
    letterSpacing: 1.5,
    marginBottom: spacing.md,
  },
  platformRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.borderFaint,
  },
  platformIcon: { fontSize: 18, width: 28 },
  platformName: { ...typography.bodyMedium, color: colors.text, flex: 1 },
  platformStatus: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },
  statusConnected: { backgroundColor: '#1B3A2A' },
  statusDisconnected: { backgroundColor: colors.surfaceVariant },
  platformStatusText: { ...typography.labelSmall, color: colors.success, fontWeight: '700' },
  sectionHeader: {
    ...typography.labelSmall,
    color: colors.textMuted,
    letterSpacing: 1.5,
    marginBottom: spacing.md,
  },
  friendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderFaint,
    gap: spacing.md,
  },
  friendAvatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.surfaceVariant },
  friendInfo: { flex: 1 },
  friendNick: { ...typography.titleSmall, color: colors.text },
  friendName: { ...typography.bodySmall, color: colors.textSecondary },
  chatBtn: { padding: spacing.sm },
  chatBtnText: { fontSize: 22 },
  addFriendBtn: {
    marginTop: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.accent,
    alignItems: 'center',
  },
  addFriendText: { ...typography.labelLarge, color: colors.accent },
  articleCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  articleImage: { width: '100%', height: 150 },
  articleBody: { padding: spacing.base, gap: spacing.xs },
  articleSource: { ...typography.labelSmall, color: colors.textMuted },
  articleTitle: { ...typography.titleMedium, color: colors.text },
  articleSummary: { ...typography.bodySmall, color: colors.textSecondary },
  articleReadMore: { ...typography.labelMedium, color: colors.accent, marginTop: spacing.xs },
  gameCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm,
    gap: spacing.md,
  },
  gameIcon: { fontSize: 32, width: 44, textAlign: 'center' },
  gameInfo: { flex: 1 },
  gameTitle: { ...typography.titleMedium, color: colors.text },
  gameDesc: { ...typography.bodySmall, color: colors.textSecondary, marginTop: 2 },
  gameArrow: { fontSize: 24, color: colors.textMuted },
});
