import React, { useRef, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import PagerView from 'react-native-pager-view';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import NovitaScreen from '../NovitaScreen';
import SegitiScreen from '../SegitiScreen';
import StatisticheScreen from '../StatisticheScreen';
import { colors } from '../../theme';

// Page order: Seguiti (0) | Novità (1) | Statistiche (2)
// Default page: Novità (index 1)
const PAGES = [
  { key: 'seguiti', component: SegitiScreen },
  { key: 'novita', component: NovitaScreen },
  { key: 'statistiche', component: StatisticheScreen },
];

export default function HomeSwiperScreen() {
  const pagerRef = useRef<PagerView>(null);
  const [currentPage, setCurrentPage] = useState(1); // default: Novità
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
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

      {/* Page indicator dots */}
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
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: colors.textMuted,
  },
  dotActive: {
    width: 16,
    borderRadius: 2.5,
    backgroundColor: colors.accent,
  },
});
