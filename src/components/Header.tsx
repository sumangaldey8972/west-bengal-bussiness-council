import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Menu, Bell, Search, ShieldCheck, QrCode } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { useApp } from '../context/AppContext';
import { BrandLogo } from './BrandLogo';

interface HeaderProps {
  onSearchFocus?: () => void;
  showSearchBar?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onSearchFocus, showSearchBar = true }) => {
  const { currentUser, openDrawer, openDigitalBusinessCard, activeSearchQuery, setActiveSearchQuery } = useApp();

  return (
    <View style={styles.container}>
      {/* Top Bar with Brand & Actions */}
      <View style={styles.topRow}>
        <View style={styles.leftBrandSection}>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={openDrawer}
            activeOpacity={0.7}
            accessibilityLabel="Open Navigation Menu"
          >
            <Menu color={colors.primary} size={22} />
          </TouchableOpacity>

          <BrandLogo size="small" showTagline={true} />
        </View>

        <View style={styles.rightActionIcons}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => openDigitalBusinessCard()}
            activeOpacity={0.7}
            accessibilityLabel="View Digital Business Card"
          >
            <QrCode color={colors.primary} size={20} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconButton}
            activeOpacity={0.7}
            accessibilityLabel="Notifications"
          >
            <Bell color={colors.textSecondary} size={20} />
            <View style={styles.badgeDot} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Greeting & Verification Banner */}
      <View style={styles.memberGreetingRow}>
        <View>
          <Text style={styles.greetingText}>
            Namaskar, <Text style={styles.memberName}>{currentUser.name.split(' ')[0]}</Text>
          </Text>
          <Text style={styles.chapterBadgeText}>
            {currentUser.chapter} • <Text style={styles.tierText}>{currentUser.membershipTier}</Text>
          </Text>
        </View>
        <View style={styles.gstVerifiedPill}>
          <ShieldCheck color={colors.emerald} size={14} />
          <Text style={styles.gstVerifiedText}>GST Verified</Text>
        </View>
      </View>

      {/* Global Search Bar */}
      {showSearchBar && (
        <View style={styles.searchContainer}>
          <Search color={colors.textSecondary} size={18} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search business owners, GSTIN, chapters, meetings..."
            placeholderTextColor={colors.textMuted}
            value={activeSearchQuery}
            onChangeText={setActiveSearchQuery}
            onFocus={onSearchFocus}
          />
          {activeSearchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setActiveSearchQuery('')} style={styles.clearBtn}>
              <Text style={styles.clearBtnText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.cardBg,
    paddingTop: 8,
    paddingBottom: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  leftBrandSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuButton: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: colors.cardBgElevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  brandTitleContainer: {
    flex: 1,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  crestBadge: {
    backgroundColor: colors.crimson,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    marginRight: 8,
  },
  crestText: {
    color: colors.white,
    fontWeight: '900',
    fontSize: 11,
    letterSpacing: 1,
  },
  brandTitle: {
    color: colors.primary,
    fontWeight: '800',
    fontSize: 13,
    letterSpacing: 0.8,
  },
  brandSubtitle: {
    color: colors.crimson,
    fontSize: 9.5,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  rightActionIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.cardBgElevated,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.cardBorder,
    position: 'relative',
  },
  badgeDot: {
    position: 'absolute',
    top: 7,
    right: 8,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.crimson,
    borderWidth: 1,
    borderColor: colors.white,
  },
  memberGreetingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 2,
  },
  greetingText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '400',
  },
  memberName: {
    color: colors.textPrimary,
    fontWeight: '700',
    fontSize: 14,
  },
  chapterBadgeText: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },
  tierText: {
    color: colors.crimson,
    fontWeight: '700',
  },
  gstVerifiedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.emeraldLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.emeraldBorder,
    gap: 4,
  },
  gstVerifiedText: {
    color: colors.emerald,
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBgElevated,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    paddingHorizontal: 12,
    height: 42,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 13,
    height: '100%',
  },
  clearBtn: {
    padding: 4,
  },
  clearBtnText: {
    color: colors.textMuted,
    fontSize: 12,
  },
});
