import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  StyleSheet,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSettingsStore } from '../../store/settingsStore';
import { colors, spacing, radius, typography } from '../../theme';
import { AppSettings, QualityOption, AudioFormat } from '../../types';

// ─── Generic setting row ──────────────────────────────────────────────────────

function ToggleRow({
  label,
  sublabel,
  value,
  onToggle,
}: {
  label: string;
  sublabel?: string;
  value: boolean;
  onToggle: () => void;
}) {
  return (
    <View style={rowStyles.row}>
      <View style={rowStyles.info}>
        <Text style={rowStyles.label}>{label}</Text>
        {sublabel && <Text style={rowStyles.sublabel}>{sublabel}</Text>}
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: colors.border, true: colors.accent }}
        thumbColor="#FFFFFF"
      />
    </View>
  );
}

function SelectRow<T extends string>({
  label,
  value,
  options,
  onSelect,
}: {
  label: string;
  value: T;
  options: { key: T; label: string }[];
  onSelect: (v: T) => void;
}) {
  return (
    <View style={rowStyles.row}>
      <Text style={rowStyles.label}>{label}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={rowStyles.optionRow}>
        {options.map(o => (
          <TouchableOpacity
            key={o.key}
            style={[rowStyles.optionChip, value === o.key && rowStyles.optionChipActive]}
            onPress={() => onSelect(o.key)}
          >
            <Text style={[rowStyles.optionText, value === o.key && rowStyles.optionTextActive]}>
              {o.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const rowStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderFaint,
  },
  info: { flex: 1, marginRight: spacing.md },
  label: { ...typography.bodyMedium, color: colors.text },
  sublabel: { ...typography.bodySmall, color: colors.textSecondary, marginTop: 2 },
  optionRow: { gap: spacing.xs, flexDirection: 'row', paddingVertical: 4 },
  optionChip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  optionChipActive: { backgroundColor: colors.accentContainer, borderColor: colors.accent },
  optionText: { ...typography.labelSmall, color: colors.textSecondary },
  optionTextActive: { color: colors.accent, fontWeight: '700' },
});

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({
  title,
  children,
  onReset,
}: {
  title: string;
  children: React.ReactNode;
  onReset: () => void;
}) {
  const [open, setOpen] = useState(true);
  return (
    <View style={secStyles.section}>
      <TouchableOpacity
        style={secStyles.sectionHeader}
        onPress={() => setOpen(o => !o)}
        activeOpacity={0.7}
      >
        <Text style={secStyles.sectionTitle}>{title}</Text>
        <View style={secStyles.sectionRight}>
          <TouchableOpacity
            onPress={() => {
              Alert.alert('Reset sezione', `Ripristinare le impostazioni di ${title}?`, [
                { text: 'Annulla', style: 'cancel' },
                { text: 'Ripristina', onPress: onReset },
              ]);
            }}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={secStyles.resetText}>↺</Text>
          </TouchableOpacity>
          <Text style={secStyles.chevron}>{open ? '▾' : '▸'}</Text>
        </View>
      </TouchableOpacity>
      {open && <View style={secStyles.sectionBody}>{children}</View>}
    </View>
  );
}

const secStyles = StyleSheet.create({
  section: {
    marginBottom: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.base,
  },
  sectionTitle: {
    ...typography.titleSmall,
    color: colors.textSecondary,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  sectionRight: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  resetText: { fontSize: 18, color: colors.textMuted },
  chevron: { fontSize: 16, color: colors.textMuted },
  sectionBody: {},
});

// ─── Main screen ──────────────────────────────────────────────────────────────

const QUALITY_OPTIONS: { key: QualityOption; label: string }[] = [
  { key: '128kbps', label: '128' },
  { key: '256kbps', label: '256' },
  { key: '320kbps', label: '320' },
  { key: 'lossless', label: 'Lossless' },
];

const FORMAT_OPTIONS: { key: AudioFormat; label: string }[] = [
  { key: 'mp3', label: 'MP3' },
  { key: 'mp4', label: 'MP4' },
  { key: 'aac', label: 'AAC' },
  { key: 'flac', label: 'FLAC' },
  { key: 'ogg', label: 'OGG' },
];

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { settings: s, update, reset, resetSection } = useSettingsStore();

  const t = (v: boolean, key: keyof AppSettings) => update({ [key]: !v } as any);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>IMPOSTAZIONI</Text>
        <TouchableOpacity
          style={styles.resetAllBtn}
          onPress={() =>
            Alert.alert('Reimposta tutto', 'Ripristinare tutte le impostazioni ai valori predefiniti?', [
              { text: 'Annulla', style: 'cancel' },
              { text: 'REIMPOSTA', style: 'destructive', onPress: reset },
            ])
          }
        >
          <Text style={styles.resetAllText}>REIMPOSTA</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Aspetto */}
        <Section title="Aspetto" onReset={() => resetSection(['theme', 'accentColor', 'backgroundColor', 'textColor', 'fontSize', 'reduceAnimations', 'highContrast', 'hapticFeedback'])}>
          <SelectRow
            label="Tema"
            value={s.theme}
            options={[{ key: 'dark', label: 'Scuro' }, { key: 'light', label: 'Chiaro' }, { key: 'system', label: 'Sistema' }]}
            onSelect={v => update({ theme: v })}
          />
          <SelectRow
            label="Dimensione testo"
            value={s.fontSize}
            options={[
              { key: 'small', label: 'Piccolo' },
              { key: 'normal', label: 'Normale' },
              { key: 'large', label: 'Grande' },
              { key: 'xlarge', label: 'XL' },
            ]}
            onSelect={v => update({ fontSize: v })}
          />
          <ToggleRow label="Riduci animazioni" value={s.reduceAnimations} onToggle={() => t(s.reduceAnimations, 'reduceAnimations')} />
          <ToggleRow label="Contrasto elevato" value={s.highContrast} onToggle={() => t(s.highContrast, 'highContrast')} />
          <ToggleRow label="Feedback aptico" value={s.hapticFeedback} onToggle={() => t(s.hapticFeedback, 'hapticFeedback')} />
        </Section>

        {/* Riproduzione / Streaming */}
        <Section title="Riproduzione / Streaming" onReset={() => resetSection(['streamingFormat', 'streamingQuality', 'streamingQualityMobile', 'crossfade', 'crossfadeDuration', 'normalizeVolume', 'wifiOnlyStreaming'])}>
          <SelectRow label="Formato streaming" value={s.streamingFormat} options={FORMAT_OPTIONS} onSelect={v => update({ streamingFormat: v })} />
          <SelectRow label="Qualità Wi-Fi" value={s.streamingQuality} options={QUALITY_OPTIONS} onSelect={v => update({ streamingQuality: v })} />
          <SelectRow label="Qualità dati mobili" value={s.streamingQualityMobile} options={QUALITY_OPTIONS} onSelect={v => update({ streamingQualityMobile: v })} />
          <ToggleRow label="Crossfade" sublabel={s.crossfade ? `${s.crossfadeDuration}s` : undefined} value={s.crossfade} onToggle={() => t(s.crossfade, 'crossfade')} />
          <ToggleRow label="Normalizzazione volume" value={s.normalizeVolume} onToggle={() => t(s.normalizeVolume, 'normalizeVolume')} />
          <ToggleRow label="Solo Wi-Fi" value={s.wifiOnlyStreaming} onToggle={() => t(s.wifiOnlyStreaming, 'wifiOnlyStreaming')} />
        </Section>

        {/* Download */}
        <Section title="Download" onReset={() => resetSection(['downloadFormat', 'downloadQuality', 'confirmBeforeDownload', 'wifiOnlyDownload', 'autoDownloadLiked'])}>
          <SelectRow label="Formato download" value={s.downloadFormat} options={FORMAT_OPTIONS} onSelect={v => update({ downloadFormat: v })} />
          <SelectRow label="Qualità download" value={s.downloadQuality} options={QUALITY_OPTIONS} onSelect={v => update({ downloadQuality: v })} />
          <ToggleRow label="Conferma pre-download" value={s.confirmBeforeDownload} onToggle={() => t(s.confirmBeforeDownload, 'confirmBeforeDownload')} />
          <ToggleRow label="Solo Wi-Fi" value={s.wifiOnlyDownload} onToggle={() => t(s.wifiOnlyDownload, 'wifiOnlyDownload')} />
          <ToggleRow label="Download automatico Mi piace" value={s.autoDownloadLiked} onToggle={() => t(s.autoDownloadLiked, 'autoDownloadLiked')} />
        </Section>

        {/* Chat e Social */}
        <Section title="Chat e Social" onReset={() => resetSection(['readReceipts', 'linkPreview', 'autoplayReceivedTracks', 'showOnlineStatus', 'whoCanMessage'])}>
          <ToggleRow label="Conferma di lettura" value={s.readReceipts} onToggle={() => t(s.readReceipts, 'readReceipts')} />
          <ToggleRow label="Anteprima link" value={s.linkPreview} onToggle={() => t(s.linkPreview, 'linkPreview')} />
          <ToggleRow label="Autoplay tracce ricevute" value={s.autoplayReceivedTracks} onToggle={() => t(s.autoplayReceivedTracks, 'autoplayReceivedTracks')} />
          <ToggleRow label="Mostra stato online" value={s.showOnlineStatus} onToggle={() => t(s.showOnlineStatus, 'showOnlineStatus')} />
          <SelectRow
            label="Chi può scriverti"
            value={s.whoCanMessage}
            options={[{ key: 'all', label: 'Tutti' }, { key: 'friends', label: 'Amici' }, { key: 'nobody', label: 'Nessuno' }]}
            onSelect={v => update({ whoCanMessage: v })}
          />
        </Section>

        {/* Privacy e sicurezza */}
        <Section title="Privacy e Sicurezza" onReset={() => resetSection(['profilePublic', 'showStats', 'showPlaylists', 'authOnStart'])}>
          <ToggleRow label="Profilo pubblico" value={s.profilePublic} onToggle={() => t(s.profilePublic, 'profilePublic')} />
          <SelectRow
            label="Visibilità statistiche"
            value={s.showStats}
            options={[{ key: 'all', label: 'Tutti' }, { key: 'friends', label: 'Amici' }, { key: 'only_me', label: 'Solo io' }]}
            onSelect={v => update({ showStats: v })}
          />
          <SelectRow
            label="Visibilità playlist"
            value={s.showPlaylists}
            options={[{ key: 'all', label: 'Tutti' }, { key: 'friends', label: 'Amici' }]}
            onSelect={v => update({ showPlaylists: v })}
          />
          <ToggleRow label="Autenticazione all'avvio" value={s.authOnStart} onToggle={() => t(s.authOnStart, 'authOnStart')} />
          <TouchableOpacity style={styles.dangerBtn}>
            <Text style={styles.dangerBtnText}>Disconnetti account</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.dangerBtn, styles.dangerBtnDestructive]}
            onPress={() =>
              Alert.alert('Elimina dati', 'Questa azione è irreversibile. Eliminare tutti i dati dell\'account?', [
                { text: 'Annulla', style: 'cancel' },
                { text: 'Elimina', style: 'destructive', onPress: () => {} },
              ])
            }
          >
            <Text style={[styles.dangerBtnText, { color: colors.error }]}>Elimina tutti i dati</Text>
          </TouchableOpacity>
        </Section>

        {/* Notifiche */}
        <Section title="Notifiche" onReset={() => resetSection(['notifyNewReleases', 'notifyMessages', 'notifyFollowRequests', 'notifyUpcomingTracks', 'notifyListenTogether', 'notifyNews', 'notifyGameChallenges', 'notifyAppUpdates', 'notifySyncConfirm', 'notifyListenReminder'])}>
          <ToggleRow label="Nuove uscite artisti seguiti" value={s.notifyNewReleases} onToggle={() => t(s.notifyNewReleases, 'notifyNewReleases')} />
          <ToggleRow label="Messaggi in chat" value={s.notifyMessages} onToggle={() => t(s.notifyMessages, 'notifyMessages')} />
          <ToggleRow label="Richieste di follow" value={s.notifyFollowRequests} onToggle={() => t(s.notifyFollowRequests, 'notifyFollowRequests')} />
          <ToggleRow label="Canzoni in uscita" value={s.notifyUpcomingTracks} onToggle={() => t(s.notifyUpcomingTracks, 'notifyUpcomingTracks')} />
          <ToggleRow label="Inviti listen together" value={s.notifyListenTogether} onToggle={() => t(s.notifyListenTogether, 'notifyListenTogether')} />
          <ToggleRow label="Nuovi articoli notizie" value={s.notifyNews} onToggle={() => t(s.notifyNews, 'notifyNews')} />
          <ToggleRow label="Sfide giochi da amici" value={s.notifyGameChallenges} onToggle={() => t(s.notifyGameChallenges, 'notifyGameChallenges')} />
          <ToggleRow label="Aggiornamenti app" value={s.notifyAppUpdates} onToggle={() => t(s.notifyAppUpdates, 'notifyAppUpdates')} />
          <ToggleRow label="Conferma sincronizzazione" value={s.notifySyncConfirm} onToggle={() => t(s.notifySyncConfirm, 'notifySyncConfirm')} />
          <ToggleRow label="Promemoria ascolto" sublabel={`Dopo ${s.listenReminderDays} giorni di inattività`} value={s.notifyListenReminder} onToggle={() => t(s.notifyListenReminder, 'notifyListenReminder')} />
        </Section>

        {/* Giochi */}
        <Section title="Giochi" onReset={() => resetSection(['defaultDifficulty', 'gameTrackSource', 'gameSounds'])}>
          <SelectRow
            label="Difficoltà predefinita"
            value={s.defaultDifficulty}
            options={[{ key: 'easy', label: 'Facile' }, { key: 'medium', label: 'Medio' }, { key: 'hard', label: 'Difficile' }]}
            onSelect={v => update({ defaultDifficulty: v })}
          />
          <SelectRow
            label="Sorgente tracce"
            value={s.gameTrackSource}
            options={[{ key: 'followed', label: 'Seguiti' }, { key: 'liked', label: 'Mi piace' }, { key: 'library', label: 'Libreria' }]}
            onSelect={v => update({ gameTrackSource: v })}
          />
          <ToggleRow label="Effetti sonori" value={s.gameSounds} onToggle={() => t(s.gameSounds, 'gameSounds')} />
        </Section>

        {/* VERSE/BOT */}
        <Section title="VERSE / BOT" onReset={() => resetSection(['botLanguage', 'botVoiceResponse', 'saveBotHistory'])}>
          <SelectRow
            label="Lingua risposte"
            value={s.botLanguage}
            options={[{ key: 'it', label: 'Italiano' }, { key: 'en', label: 'English' }, { key: 'system', label: 'Sistema' }]}
            onSelect={v => update({ botLanguage: v })}
          />
          <ToggleRow label="Risposta vocale" value={s.botVoiceResponse} onToggle={() => t(s.botVoiceResponse, 'botVoiceResponse')} />
          <ToggleRow label="Salva storico chat" value={s.saveBotHistory} onToggle={() => t(s.saveBotHistory, 'saveBotHistory')} />
          <TouchableOpacity
            style={styles.dangerBtn}
            onPress={() =>
              Alert.alert('Elimina storico', 'Eliminare tutto lo storico del bot?', [
                { text: 'Annulla', style: 'cancel' },
                { text: 'Elimina', style: 'destructive', onPress: () => {} },
              ])
            }
          >
            <Text style={styles.dangerBtnText}>Elimina storico chat bot</Text>
          </TouchableOpacity>
        </Section>

        {/* Notizie musicali */}
        <Section title="Notizie Musicali" onReset={() => resetSection(['defaultReadMode', 'autoUpdateNews', 'newsUpdateFrequency', 'notifyNewArticles'])}>
          <SelectRow
            label="Modalità lettura"
            value={s.defaultReadMode}
            options={[{ key: 'essential', label: 'Essenziale' }, { key: 'original', label: 'Originale' }]}
            onSelect={v => update({ defaultReadMode: v })}
          />
          <ToggleRow label="Aggiornamento automatico" value={s.autoUpdateNews} onToggle={() => t(s.autoUpdateNews, 'autoUpdateNews')} />
          <SelectRow
            label="Frequenza aggiornamento"
            value={s.newsUpdateFrequency}
            options={[{ key: '1h', label: '1h' }, { key: '6h', label: '6h' }, { key: '12h', label: '12h' }, { key: '24h', label: '24h' }]}
            onSelect={v => update({ newsUpdateFrequency: v })}
          />
          <ToggleRow label="Notifica nuovi articoli" value={s.notifyNewArticles} onToggle={() => t(s.notifyNewArticles, 'notifyNewArticles')} />
        </Section>

        {/* Informazioni app */}
        <View style={[secStyles.section, { marginBottom: spacing.xxxl }]}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Versione</Text>
            <Text style={styles.infoValue}>1.0.0</Text>
          </View>
          <TouchableOpacity style={styles.infoRow}>
            <Text style={styles.infoLabel}>Changelog</Text>
            <Text style={styles.infoArrow}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.infoRow}>
            <Text style={styles.infoLabel}>Termini di servizio</Text>
            <Text style={styles.infoArrow}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.infoRow}>
            <Text style={styles.infoLabel}>Privacy policy</Text>
            <Text style={styles.infoArrow}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.infoRow}>
            <Text style={styles.infoLabel}>Contatta il supporto</Text>
            <Text style={styles.infoArrow}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.infoRow}>
            <Text style={styles.infoLabel}>Valuta l'app</Text>
            <Text style={styles.infoArrow}>⭐</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  resetAllBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.error,
  },
  resetAllText: {
    ...typography.labelSmall,
    color: colors.error,
    letterSpacing: 1,
  },
  content: {
    padding: spacing.base,
    paddingBottom: spacing.xxxl,
    gap: spacing.sm,
  },
  dangerBtn: {
    marginHorizontal: spacing.base,
    marginVertical: spacing.sm,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceVariant,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  dangerBtnDestructive: {
    borderColor: colors.error + '44',
  },
  dangerBtnText: {
    ...typography.labelLarge,
    color: colors.textSecondary,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderFaint,
  },
  infoLabel: { ...typography.bodyMedium, color: colors.text },
  infoValue: { ...typography.bodyMedium, color: colors.textSecondary },
  infoArrow: { ...typography.bodyMedium, color: colors.textMuted },
});
