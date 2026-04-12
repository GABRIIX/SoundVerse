import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, TAB_BAR_HEIGHT } from '../theme';
import { useSettingsStore } from '../store/settingsStore';

type TabRoute = 'Profile' | 'Settings' | 'Home' | 'Playlist' | 'Search';

// Unicode outline-style icons matching the screenshot
const TAB_ICONS: Record<TabRoute, string> = {
  Profile: '⊙',   // person
  Settings: '✦',  // settings/gear approximation
  Home: '⌂',      // home
  Playlist: '⊞',  // grid/playlist
  Search: '⊕',    // search
};

// Emoji icons as fallback — matches screenshot more closely
const EMOJI_ICONS: Record<TabRoute, string> = {
  Profile: '○',
  Settings: '⚙',
  Home: '⌂',
  Playlist: '▣',
  Search: '◎',
};

export default function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const accent = useSettingsStore(s => s.settings.accentColor);

  return (
    <View
      style={[
        styles.container,
        { paddingBottom: Math.max(insets.bottom, 6) },
      ]}
    >
      {state.routes.map((route, index) => {
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
            activeOpacity={0.6}
          >
            {/* Active dot above icon */}
            {isFocused && (
              <View style={[styles.activeDot, { backgroundColor: accent }]} />
            )}
            <Text
              style={[
                styles.icon,
                isFocused
                  ? { color: '#FFFFFF', transform: [{ scale: 1.1 }] }
                  : { color: '#444444' },
              ]}
            >
              {EMOJI_ICONS[routeName]}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000000',
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#1A1A1A',
    paddingTop: 8,
  },
  tab: {
    flex: 1,
    height: TAB_BAR_HEIGHT - 10,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  activeDot: {
    position: 'absolute',
    top: -2,
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  icon: {
    fontSize: 22,
  },
});
