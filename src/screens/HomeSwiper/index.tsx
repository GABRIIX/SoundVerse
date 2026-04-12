import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import PagerView from 'react-native-pager-view';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import NovitaScreen from '../NovitaScreen';
import SegitiScreen from '../SegitiScreen';
import StatisticheScreen from '../StatisticheScreen';
import { colors, spacing } from '../../theme';

// Page order: Seguiti (0) | Novità (1) | Statistiche (2)
// Default page: Novità (index 1)
const PAGES = [
  { key: 'seguiti', label: 'SEGUITI', component: SegitiScreen },
  { key: 'novita', label: 'NOVITÀ', component: NovitaScreen },
  { key: 'statistiche', label: 'STATISTICHE', component: StatisticheScreen },
];

export default function HomeSwiperScreen() {
  const pagerRef = useRef<PagerView>(null);
  const [currentPage, setCurrentPage] = useState(1); // default: Novità
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Page label dots — tappable */}
      <View style={styles.pageLabels}>
        {PAGES.map((p, i) => (
          <TouchableOpacity
            key={p.key}
            onPress={() => pagerRef.current?.setPage(i)}
            style={styles.pageLabelBtn}
            activeOpacity={0.7}
          >
            <Text style={[styles.pageLabelText, currentPage === i && styles.pageLabelTextActive]}>
              {p.label}
            </Text>
            {currentPage === i && <View style={styles.pageUnderline} />}
          </TouchableOpacity>
        ))}
      </View>

      <PagerView
        ref={pagerRef}
        style={styles.pager}
        initialPage={1}
        onPageSelected={e => setCurrentPage(e.nativeEvent.position)}
      >
        {PAGES.map(({ key, component: Screen }) => (
          <View key={key} style={styles.page}>
            <Screen />
          </View>
        ))}
      </PagerView>

      {/* Indicator dots at bottom */}
      <View style={styles.dots}>
        {PAGES.map((p, i) => (
          <View
            key={p.key}
            style={[styles.dot, currentPage === i && styles.dotActive]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  pageLabels: {
    flexDirection: 'row',
    paddingHorizontal: spacing.base,
    gap: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderFaint,
  },
  pageLabelBtn: {
    paddingBottom: spacing.sm,
    paddingTop: spacing.sm,
    position: 'relative',
  },
  pageLabelText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 1.5,
  },
  pageLabelTextActive: {
    color: colors.text,
  },
  pageUnderline: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: colors.accent,
  },
  pager: {
    flex: 1,
  },
  page: {
    flex: 1,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 6,
    gap: 6,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.textMuted,
  },
  dotActive: {
    width: 14,
    borderRadius: 2,
    backgroundColor: colors.accent,
  },
});
