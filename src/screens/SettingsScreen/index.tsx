import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  StyleSheet,
  Alert,
  Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSettingsStore } from '../../store/settingsStore';
import { colors, spacing, typography } from '../../theme';
import { AppSettings, QualityOption, AudioFormat } from '../../types';
import ScreenHeader from '../../components/ScreenHeader';
import { FONT_OPTIONS, FONT_MAP, FontFamily } from '../../context/FontContext';

// ─── Row components ───────────────────────────────────────────────────────────

function SettingRow({
  label,
  value,
  onPress,
}: {
  label: string;
  value: string;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity
      style={styles.row}
      onPress={onPress}
      activeOpacity={onPress ? 0.6 : 1}
    >
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </TouchableOpacity>
  );
}

function ToggleRow({
  label,
  value,
  onToggle,
}: {
  label: string;
  value: boolean;
  onToggle: () => void;
}) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: '#2A2A2A', true: colors.accent }}
        thumbColor="#FFFFFF"
        style={{ marginLeft: spacing.sm }}
      />
    </View>
  );
}

function SectionHeader({ title }: { title: string }) {
  return <Text style={styles.sectionHeader}>{title}</Text>;
}

// ─── Picker helpers ───────────────────────────────────────────────────────────

function cycleOption<T extends string>(current: T, options: T[]): T {
  const idx = options.indexOf(current);
  return options[(idx + 1) % options.length];
}

const QUALITY_OPTIONS: QualityOption[] = ['128kbps', '256kbps', '320kbps', 'lossless'];
const FORMAT_OPTIONS: AudioFormat[] = ['mp3', 'mp4', 'aac', 'flac', 'ogg'];

// ─── Main screen ──────────────────────────────────────────────────────────────

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { settings: s, update, reset } = useSettingsStore();
  const tog = (key: keyof AppSettings) => update({ [key]: !s[key] } as any);
  const [fontPickerOpen, setFontPickerOpen] = useState(false);

  const currentFont = FONT_OPTIONS.find(f => f.key === s.fontFamily) ?? FONT_OPTIONS[0];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScreenHeader
        title="IMPOSTAZIONI"
        rightLabel="REINPOSTA"
        onRightPress={() =>
          Alert.alert('Reimposta', 'Ripristinare tutte le impostazioni?', [
            { text: 'Annulla', style: 'cancel' },
            { text: 'REIMPOSTA', style: 'destructive', onPress: reset },
          ])
        }
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* LINGUA / REGIONE */}
        <SectionHeader title="LINGUA/REGIONE" />
        <SettingRow label="LINGUA" value="ITALIANO" />
        <SettingRow label="REGIONE" value="ITALIA" />

        {/* ASPETTO */}
        <SectionHeader title="ASPETTO" />
        <SettingRow
          label="FONT"
          value={currentFont.label}
          onPress={() => setFontPickerOpen(true)}
        />
        <SettingRow
          label="TEMA"
          value={s.theme === 'dark' ? 'SCURO' : s.theme === 'light' ? 'CHIARO' : 'SISTEMA'}
          onPress={() => update({ theme: cycleOption(s.theme, ['dark', 'light', 'system']) })}
        />
        <SettingRow
          label="COLORE"
          value={s.accentColor.toUpperCase()}
        />
        <SettingRow
          label="FONT SIZE"
          value={s.fontSize.toUpperCase()}
          onPress={() => update({ fontSize: cycleOption(s.fontSize, ['small', 'normal', 'large', 'xlarge']) })}
        />
        <ToggleRow label="RIDUCI ANIMAZIONI" value={s.reduceAnimations} onToggle={() => tog('reduceAnimations')} />
        <ToggleRow label="CONTRASTO ELEVATO" value={s.highContrast} onToggle={() => tog('highContrast')} />
        <ToggleRow label="FEEDBACK APTICO" value={s.hapticFeedback} onToggle={() => tog('hapticFeedback')} />

        {/* RIPRODUZIONE/STREAMING */}
        <SectionHeader title="RIPRODUZIONE/STREAMING" />
        <SettingRow
          label="FORMATO"
          value={s.streamingFormat.toUpperCase()}
          onPress={() => update({ streamingFormat: cycleOption(s.streamingFormat, FORMAT_OPTIONS) })}
        />
        <SettingRow
          label="QUALITA'"
          value={s.streamingQuality.toUpperCase()}
          onPress={() => update({ streamingQuality: cycleOption(s.streamingQuality, QUALITY_OPTIONS) })}
        />
        <SettingRow
          label="QUALITA' MOBILE"
          value={s.streamingQualityMobile.toUpperCase()}
          onPress={() => update({ streamingQualityMobile: cycleOption(s.streamingQualityMobile, QUALITY_OPTIONS) })}
        />
        <ToggleRow label={`CROSSFADE ${s.crossfade ? s.crossfadeDuration + 'S' : ''}`} value={s.crossfade} onToggle={() => tog('crossfade')} />
        <ToggleRow label="NORM. VOLUME" value={s.normalizeVolume} onToggle={() => tog('normalizeVolume')} />
        <ToggleRow label="SOLO WI-FI" value={s.wifiOnlyStreaming} onToggle={() => tog('wifiOnlyStreaming')} />

        {/* DOWNLOADS */}
        <SectionHeader title="DOWNLOADS" />
        <SettingRow
          label="FORMATO"
          value={s.downloadFormat.toUpperCase()}
          onPress={() => update({ downloadFormat: cycleOption(s.downloadFormat, FORMAT_OPTIONS) })}
        />
        <SettingRow
          label="QUALITA'"
          value={s.downloadQuality.toUpperCase()}
          onPress={() => update({ downloadQuality: cycleOption(s.downloadQuality, QUALITY_OPTIONS) })}
        />
        <SettingRow
          label="CARTELLA"
          value={s.downloadFolder}
        />
        <SettingRow
          label="TIMEOUT"
          value={`${s.downloadTimeout} MIN`}
        />
        <ToggleRow label="SOLO WI-FI" value={s.wifiOnlyDownload} onToggle={() => tog('wifiOnlyDownload')} />
        <ToggleRow label="AUTO-DL MI PIACE" value={s.autoDownloadLiked} onToggle={() => tog('autoDownloadLiked')} />
        <ToggleRow label="CONFERMA PRE-DL" value={s.confirmBeforeDownload} onToggle={() => tog('confirmBeforeDownload')} />

        {/* NOTIFICHE */}
        <SectionHeader title="NOTIFICHE" />
        <ToggleRow label="NUOVE USCITE" value={s.notifyNewReleases} onToggle={() => tog('notifyNewReleases')} />
        <ToggleRow label="MESSAGGI" value={s.notifyMessages} onToggle={() => tog('notifyMessages')} />
        <ToggleRow label="FOLLOW" value={s.notifyFollowRequests} onToggle={() => tog('notifyFollowRequests')} />
        <ToggleRow label="CANZONI IN USCITA" value={s.notifyUpcomingTracks} onToggle={() => tog('notifyUpcomingTracks')} />
        <ToggleRow label="LISTEN TOGETHER" value={s.notifyListenTogether} onToggle={() => tog('notifyListenTogether')} />
        <ToggleRow label="NOTIZIE" value={s.notifyNews} onToggle={() => tog('notifyNews')} />
        <ToggleRow label="SFIDE GIOCHI" value={s.notifyGameChallenges} onToggle={() => tog('notifyGameChallenges')} />

        {/* CHAT E SOCIAL */}
        <SectionHeader title="CHAT E SOCIAL" />
        <ToggleRow label="CONFERMA LETTURA" value={s.readReceipts} onToggle={() => tog('readReceipts')} />
        <ToggleRow label="ANTEPRIMA LINK" value={s.linkPreview} onToggle={() => tog('linkPreview')} />
        <ToggleRow label="STATO ONLINE" value={s.showOnlineStatus} onToggle={() => tog('showOnlineStatus')} />
        <SettingRow
          label="CHI PUÒ SCRIVERE"
          value={s.whoCanMessage === 'all' ? 'TUTTI' : s.whoCanMessage === 'friends' ? 'AMICI' : 'NESSUNO'}
          onPress={() => update({ whoCanMessage: cycleOption(s.whoCanMessage, ['all', 'friends', 'nobody']) })}
        />

        {/* PRIVACY */}
        <SectionHeader title="PRIVACY E SICUREZZA" />
        <ToggleRow label="PROFILO PUBBLICO" value={s.profilePublic} onToggle={() => tog('profilePublic')} />
        <SettingRow
          label="STATISTICHE"
          value={s.showStats === 'all' ? 'TUTTI' : s.showStats === 'friends' ? 'AMICI' : 'SOLO IO'}
          onPress={() => update({ showStats: cycleOption(s.showStats, ['all', 'friends', 'only_me']) })}
        />
        <ToggleRow label="AUTH AVVIO" value={s.authOnStart} onToggle={() => tog('authOnStart')} />
        <TouchableOpacity style={styles.dangerRow}>
          <Text style={styles.dangerLabel}>DISCONNETTI ACCOUNT</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.dangerRow}
          onPress={() =>
            Alert.alert('Elimina dati', 'Eliminare tutti i dati?', [
              { text: 'Annulla', style: 'cancel' },
              { text: 'ELIMINA', style: 'destructive', onPress: () => {} },
            ])
          }
        >
          <Text style={[styles.dangerLabel, { color: colors.error }]}>ELIMINA TUTTI I DATI</Text>
        </TouchableOpacity>

        {/* GIOCHI */}
        <SectionHeader title="GIOCHI" />
        <SettingRow
          label="DIFFICOLTÀ"
          value={s.defaultDifficulty === 'easy' ? 'FACILE' : s.defaultDifficulty === 'medium' ? 'MEDIO' : 'DIFFICILE'}
          onPress={() => update({ defaultDifficulty: cycleOption(s.defaultDifficulty, ['easy', 'medium', 'hard']) })}
        />
        <SettingRow
          label="SORGENTE"
          value={s.gameTrackSource === 'followed' ? 'SEGUITI' : s.gameTrackSource === 'liked' ? 'MI PIACE' : 'LIBRERIA'}
          onPress={() => update({ gameTrackSource: cycleOption(s.gameTrackSource, ['followed', 'liked', 'library']) })}
        />
        <ToggleRow label="EFFETTI SONORI" value={s.gameSounds} onToggle={() => tog('gameSounds')} />

        {/* VERSE/BOT */}
        <SectionHeader title="VERSE/BOT" />
        <SettingRow
          label="LINGUA BOT"
          value={s.botLanguage === 'it' ? 'ITALIANO' : s.botLanguage === 'en' ? 'ENGLISH' : 'SISTEMA'}
          onPress={() => update({ botLanguage: cycleOption(s.botLanguage, ['it', 'en', 'system']) })}
        />
        <ToggleRow label="RISPOSTA VOCALE" value={s.botVoiceResponse} onToggle={() => tog('botVoiceResponse')} />
        <ToggleRow label="SALVA STORICO" value={s.saveBotHistory} onToggle={() => tog('saveBotHistory')} />
        <TouchableOpacity style={styles.dangerRow}>
          <Text style={styles.dangerLabel}>ELIMINA STORICO BOT</Text>
        </TouchableOpacity>

        {/* NOTIZIE */}
        <SectionHeader title="NOTIZIE MUSICALI" />
        <SettingRow
          label="LETTURA"
          value={s.defaultReadMode === 'essential' ? 'ESSENZIALE' : 'ORIGINALE'}
          onPress={() => update({ defaultReadMode: cycleOption(s.defaultReadMode, ['essential', 'original']) })}
        />
        <ToggleRow label="AGGIORNAMENTO AUTO" value={s.autoUpdateNews} onToggle={() => tog('autoUpdateNews')} />
        <SettingRow
          label="FREQUENZA"
          value={s.newsUpdateFrequency.toUpperCase()}
          onPress={() => update({ newsUpdateFrequency: cycleOption(s.newsUpdateFrequency, ['1h', '6h', '12h', '24h']) })}
        />

        {/* INFO APP */}
        <SectionHeader title="INFORMAZIONI APP" />
        <SettingRow label="VERSIONE" value="1.0.0" />
        <TouchableOpacity style={styles.row}><Text style={styles.rowLabel}>CHANGELOG</Text><Text style={styles.rowValue}>›</Text></TouchableOpacity>
        <TouchableOpacity style={styles.row}><Text style={styles.rowLabel}>TERMINI</Text><Text style={styles.rowValue}>›</Text></TouchableOpacity>
        <TouchableOpacity style={styles.row}><Text style={styles.rowLabel}>PRIVACY</Text><Text style={styles.rowValue}>›</Text></TouchableOpacity>
        <TouchableOpacity style={styles.row}><Text style={styles.rowLabel}>SUPPORTO</Text><Text style={styles.rowValue}>›</Text></TouchableOpacity>
        <TouchableOpacity style={[styles.row, { marginBottom: spacing.xxxl }]}>
          <Text style={styles.rowLabel}>VALUTA L'APP</Text>
          <Text style={styles.rowValue}>⭐</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Font Picker Modal */}
      <Modal
        visible={fontPickerOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setFontPickerOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>SCEGLI FONT</Text>
            {FONT_OPTIONS.map(opt => {
              const isSelected = s.fontFamily === opt.key;
              const fontStyle = opt.fontName ? { fontFamily: opt.fontName } : {};
              return (
                <TouchableOpacity
                  key={opt.key}
                  style={[styles.fontOption, isSelected && styles.fontOptionActive]}
                  onPress={() => {
                    update({ fontFamily: opt.key as FontFamily });
                    setFontPickerOpen(false);
                  }}
                  activeOpacity={0.7}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.fontOptionLabel, fontStyle]}>
                      {opt.label}
                    </Text>
                    <Text style={styles.fontOptionDesc}>{opt.description}</Text>
                  </View>
                  {isSelected && (
                    <Text style={[styles.fontCheck, { color: colors.accent }]}>✓</Text>
                  )}
                </TouchableOpacity>
              );
            })}
            <TouchableOpacity
              style={styles.modalClose}
              onPress={() => setFontPickerOpen(false)}
            >
              <Text style={styles.modalCloseText}>CHIUDI</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: spacing.xxxl },
  sectionHeader: {
    ...typography.sectionLabel,
    paddingHorizontal: spacing.base,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
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
  dangerRow: {
    paddingHorizontal: spacing.base,
    paddingVertical: 13,
    borderTopWidth: 1,
    borderTopColor: colors.borderFaint,
  },
  dangerLabel: {
    ...typography.rowLabel,
    color: colors.textSecondary,
  },
  // Font picker modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: colors.surfaceElevated,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: spacing.xl,
    gap: spacing.xs,
    borderTopWidth: 1,
    borderColor: colors.borderFaint,
  },
  modalTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 2,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  fontOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.base,
    borderTopWidth: 1,
    borderTopColor: colors.borderFaint,
  },
  fontOptionActive: {
    backgroundColor: colors.accentContainer,
  },
  fontOptionLabel: {
    fontSize: 22,
    color: colors.text,
    letterSpacing: 1,
  },
  fontOptionDesc: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
    letterSpacing: 0.3,
  },
  fontCheck: {
    fontSize: 20,
    marginLeft: spacing.md,
  },
  modalClose: {
    marginTop: spacing.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    backgroundColor: colors.surfaceVariant,
    borderRadius: 8,
  },
  modalCloseText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 1.5,
  },
});
