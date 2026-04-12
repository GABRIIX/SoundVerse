import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing } from '../../theme';

interface Props {
  title: string;
  rightLabel?: string;
  rightIcon?: string;
  onRightPress?: () => void;
}

/**
 * Common screen header matching the screenshot style:
 *   • TITOLO          [ACTION]
 */
export default function ScreenHeader({ title, rightLabel, rightIcon, onRightPress }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <View style={styles.bullet} />
        <Text style={styles.title}>{title}</Text>
      </View>
      {(rightLabel || rightIcon) && (
        <TouchableOpacity onPress={onRightPress} style={styles.rightBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={styles.rightText}>{rightIcon ?? rightLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  bullet: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: colors.text,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.text,
    letterSpacing: 1.5,
  },
  rightBtn: {
    paddingHorizontal: 2,
  },
  rightText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: 1,
  },
});
