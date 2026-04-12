import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, TAB_BAR_HEIGHT } from '../theme';
import { useSettingsStore } from '../store/settingsStore';

type TabRoute = 'Home' | 'Search' | 'Playlist' | 'Profile' | 'Settings';

type IconSet = {
  active: keyof typeof MaterialCommunityIcons.glyphMap;
  inactive: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
};

const TAB_CONFIG: Record<TabRoute, IconSet> = {
  Home:     { active: 'home',              inactive: 'home-outline',           label: 'Home'      },
  Search:   { active: 'magnify',           inactive: 'magnify',                label: 'Cerca'     },
  Playlist: { active: 'playlist-music',    inactive: 'playlist-music-outline', label: 'Playlist'  },
  Profile:  { active: 'account-circle',    inactive: 'account-circle-outline', label: 'Profilo'   },
  Settings: { active: 'cog',              inactive: 'cog-outline',            label: 'Impostaz.' },
};

export default function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const accent = useSettingsStore(s => s.settings.accentColor);

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const routeName = route.name as TabRoute;
        const config = TAB_CONFIG[routeName];

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
            accessibilityRole="button"
            accessibilityState={{ selected: isFocused }}
            accessibilityLabel={config.label}
          >
            {/* MD3 pill indicator */}
            <View style={[
              styles.indicator,
              isFocused && { backgroundColor: accent + '30' },
            ]}>
              <MaterialCommunityIcons
                name={isFocused ? config.active : config.inactive}
                size={24}
                color={isFocused ? accent : colors.md3OnSurfaceVariant}
              />
            </View>

            {/* Label */}
            <Text style={[
              styles.label,
              { color: isFocused ? accent : colors.md3OnSurfaceVariant },
              isFocused && { fontWeight: '600' },
            ]}>
              {config.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.md3Surface,
    paddingTop: 8,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    minHeight: TAB_BAR_HEIGHT - 10,
  },
  indicator: {
    width: 64,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 10,
    letterSpacing: 0.3,
  },
});
