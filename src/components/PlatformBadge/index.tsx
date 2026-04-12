import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Platform } from '../../types';
import { colors, radius, typography } from '../../theme';

const PLATFORM_LABELS: Record<Platform, string> = {
  spotify: 'SP',
  youtube: 'YT',
  soundcloud: 'SC',
  appleMusic: 'AM',
};

const PLATFORM_COLORS: Record<Platform, string> = {
  spotify: colors.spotify,
  youtube: colors.youtube,
  soundcloud: colors.soundcloud,
  appleMusic: colors.appleMusic,
};

interface Props {
  platform: Platform;
  size?: 'sm' | 'md';
}

export default function PlatformBadge({ platform, size = 'sm' }: Props) {
  const isSmall = size === 'sm';
  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: PLATFORM_COLORS[platform] },
        isSmall ? styles.badgeSm : styles.badgeMd,
      ]}
    >
      <Text style={[styles.label, isSmall ? styles.labelSm : styles.labelMd]}>
        {PLATFORM_LABELS[platform]}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: radius.xs,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeSm: {
    paddingHorizontal: 4,
    paddingVertical: 2,
    minWidth: 22,
  },
  badgeMd: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    minWidth: 28,
  },
  label: {
    color: '#FFFFFF',
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  labelSm: {
    fontSize: 9,
  },
  labelMd: {
    fontSize: 11,
  },
});
