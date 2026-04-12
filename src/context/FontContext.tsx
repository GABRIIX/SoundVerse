import React, { createContext, useContext } from 'react';
import { useSettingsStore } from '../store/settingsStore';
import { AppSettings } from '../types';

export type FontFamily = AppSettings['fontFamily'];

export const FONT_OPTIONS: {
  key: FontFamily;
  label: string;
  fontName: string;
  description: string;
}[] = [
  { key: 'Koulen',    label: 'KOULEN',     fontName: 'Koulen_400Regular',    description: 'Bold condensed — default' },
  { key: 'Oswald',    label: 'OSWALD',     fontName: 'Oswald_700Bold',        description: 'Condensed sans-serif'     },
  { key: 'BebasNeue', label: 'BEBAS NEUE', fontName: 'BebasNeue_400Regular',  description: 'All-caps display'         },
  { key: 'Anton',     label: 'ANTON',      fontName: 'Anton_400Regular',      description: 'Bold impact'              },
  { key: 'RussoOne',  label: 'RUSSO ONE',  fontName: 'RussoOne_400Regular',   description: 'Geometric bold'           },
  { key: 'System',    label: 'SISTEMA',    fontName: '',                      description: 'Font di sistema'          },
];

export const FONT_MAP: Record<FontFamily, string | undefined> = {
  Koulen:    'Koulen_400Regular',
  Oswald:    'Oswald_700Bold',
  BebasNeue: 'BebasNeue_400Regular',
  Anton:     'Anton_400Regular',
  RussoOne:  'RussoOne_400Regular',
  System:    undefined,
};

const FontContext = createContext<string | undefined>(undefined);

export function FontProvider({ children }: { children: React.ReactNode }) {
  const fontFamily = useSettingsStore(s => s.settings.fontFamily);
  const resolvedFont = FONT_MAP[fontFamily];
  return (
    <FontContext.Provider value={resolvedFont}>
      {children}
    </FontContext.Provider>
  );
}

export function useAppFont(): string | undefined {
  return useContext(FontContext);
}
