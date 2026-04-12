/**
 * API Keys Template
 *
 * Copy this file to apiKeys.ts and fill in your credentials.
 * apiKeys.ts is gitignored — your secrets stay local.
 *
 *   cp src/config/apiKeys.template.ts src/config/apiKeys.ts
 *
 * HOW TO GET KEYS
 * ───────────────
 * YouTube  → https://console.cloud.google.com
 *            Nuovo progetto → Abilita "YouTube Data API v3"
 *            Credenziali → Crea credenziali → Chiave API
 *
 * Spotify  → https://developer.spotify.com/dashboard
 *            Crea app → Client ID + Client Secret
 *            (nessuna autenticazione utente richiesta per la ricerca)
 *
 * SoundCloud → https://soundcloud.com/you/apps
 *              Registra app → Client ID
 *              ⚠ SoundCloud ha limitato l'accesso API per nuovi sviluppatori;
 *                lascia vuoto per saltare i risultati SoundCloud.
 */
export const API_KEYS = {
  /** YouTube Data API v3 key */
  youtube: 'INSERISCI_QUI_LA_TUA_CHIAVE_YOUTUBE',

  /** Spotify application Client ID */
  spotifyClientId: 'INSERISCI_QUI_IL_TUO_CLIENT_ID_SPOTIFY',

  /** Spotify application Client Secret */
  spotifyClientSecret: 'INSERISCI_QUI_IL_TUO_CLIENT_SECRET_SPOTIFY',

  /** SoundCloud Client ID (facoltativo) */
  soundcloud: '',
} as const;
