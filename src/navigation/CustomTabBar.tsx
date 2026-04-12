import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
} from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, TAB_BAR_HEIGHT, typography } from '../theme';
import { useSettingsStore } from '../store/settingsStore';

type TabRoute = 'Profile' | 'Settings' | 'Home' | 'Playlist' | 'Search';

const TAB_ICONS: Record<TabRoute, { active: string; inactive: string }> = {
  Profile: { active: '●', inactive: '○' },
  Settings: { active: '⚙', inactive: '⚙' },
  Home: { active: '⌂', inactive: '⌂' },
  Playlist: { active: '▣', inactive: '▢' },
  Search: { active: '⊙', inactive: '○' },
};

// SVG-like text icons replacement with unicode
const SVG_ICONS: Record<TabRoute, string> = {
  Profile: '👤',
  Settings: '⚙️',
  Home: '🏠',
  Playlist: '🎵',
  Search: '🔍',
};

export default function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const accent = useSettingsStore(s => s.settings.accentColor);

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <View style={styles.bar}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;
          const routeName = route.name as TabRoute;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={styles.tab}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.icon,
                  { color: isFocused ? accent : colors.textMuted },
                  isFocused && styles.iconActive,
                ]}
              >
                {SVG_ICONS[routeName] ?? '●'}
              </Text>
              {isFocused && (
                <View style={[styles.indicator, { backgroundColor: accent }]} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  bar: {
    height: TAB_BAR_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    position: 'relative',
  },
  icon: {
    fontSize: 22,
    lineHeight: 26,
  },
  iconActive: {
    transform: [{ scale: 1.15 }],
  },
  indicator: {
    position: 'absolute',
    bottom: 6,
    width: 4,
    height: 4,
    borderRadius: 2,
  },
});
