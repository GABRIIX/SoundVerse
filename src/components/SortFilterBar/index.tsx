import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SortCriteria } from '../../types';
import { colors, spacing, radius, typography } from '../../theme';

const SORT_OPTIONS: { key: SortCriteria; label: string; paired?: SortCriteria }[] = [
  { key: 'addedDesc', label: 'Ultima aggiunta ↓', paired: 'addedAsc' },
  { key: 'releaseDateDesc', label: 'Data uscita ↓', paired: 'releaseDateAsc' },
  { key: 'titleAsc', label: 'A → Z', paired: 'titleDesc' },
  { key: 'platformDesc', label: 'Piattaforma ↓', paired: 'platformAsc' },
  { key: 'modifiedDesc', label: 'Ultima modifica ↓', paired: 'modifiedAsc' },
];

interface Props {
  value: SortCriteria;
  onChange: (sort: SortCriteria) => void;
}

export default function SortFilterBar({ value, onChange }: Props) {
  const handlePress = (option: typeof SORT_OPTIONS[0]) => {
    if (value === option.key) {
      // 2nd tap → invert
      if (option.paired) {
        onChange(option.paired);
      }
    } else if (value === option.paired) {
      // 3rd tap → back to default
      onChange('addedDesc');
    } else {
      onChange(option.key);
    }
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scroll}
      contentContainerStyle={styles.content}
    >
      {SORT_OPTIONS.map(opt => {
        const isActive = value === opt.key || value === opt.paired;
        const label =
          value === opt.paired ? opt.label.replace('↓', '↑') : opt.label;
        return (
          <TouchableOpacity
            key={opt.key}
            style={[styles.chip, isActive && styles.chipActive]}
            onPress={() => handlePress(opt)}
            activeOpacity={0.7}
          >
            <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
              {isActive
                ? value === opt.paired
                  ? opt.label.replace('↓', '↑')
                  : opt.label
                : opt.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 0,
  },
  content: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
    flexDirection: 'row',
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: 'transparent',
  },
  chipActive: {
    backgroundColor: colors.accentContainer,
    borderColor: colors.accent,
  },
  chipText: {
    ...typography.labelSmall,
    color: colors.textSecondary,
  },
  chipTextActive: {
    color: colors.accent,
    fontWeight: '600',
  },
});
