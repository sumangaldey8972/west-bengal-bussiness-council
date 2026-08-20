import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';
import {
  X,
  User,
  FileSpreadsheet,
  Settings,
  Share2,
  Calendar,
  CreditCard,
  Building,
  LogOut,
  ShieldCheck,
  ChevronRight,
  Sparkles,
} from 'lucide-react-native';
import { colors } from '../theme/colors';
import { useApp } from '../context/AppContext';

const { width } = Dimensions.get('window');

interface DrawerModalProps {
  onNavigate: (screenName: string) => void;
}

export const DrawerModal: React.FC<DrawerModalProps> = ({ onNavigate }) => {
  const { showDrawer, closeDrawer, currentUser, openDigitalBusinessCard } = useApp();

  if (!showDrawer) return null;

  const menuItems = [
    {
      id: 'profile',
      label: 'Executive Profile & GST Docs',
      sublabel: 'View company capabilities & GSTIN',
      icon: User,
      color: colors.primary,
      bgColor: colors.cardBgElevated,
      action: () => {
        closeDrawer();
        onNavigate('Profile');
      },
    },
    {
      id: 'card',
      label: 'Digital Business Card & QR',
      sublabel: 'Share visiting card or order print kit',
      icon: CreditCard,
      color: colors.crimson,
      bgColor: colors.crimsonLight,
      action: () => {
        closeDrawer();
        openDigitalBusinessCard();
      },
    },
    {
      id: 'meetings',
      label: 'Meeting Summaries & Minutes',
      sublabel: 'Bi-weekly conclave notes & archives',
      icon: FileSpreadsheet,
      color: colors.accentBlue,
      bgColor: colors.accentBlueLight,
      action: () => {
        closeDrawer();
        onNavigate('MeetingSummary');
      },
    },
    {
      id: 'referrals',
      label: 'Council Referral Desk',
      sublabel: 'Track passed & received business leads',
      icon: Share2,
      color: colors.purpleAccent,
      bgColor: colors.purpleLight,
      action: () => {
        closeDrawer();
        onNavigate('BusinessDesk');
      },
    },
    {
      id: 'events',
      label: 'Events & Vision Conclaves',
      sublabel: 'Upcoming trade meets & delegations',
      icon: Calendar,
      color: colors.crimson,
      bgColor: colors.crimsonLight,
      action: () => {
        closeDrawer();
        onNavigate('Events');
      },
    },
    {
      id: 'invite',
      label: 'Invite Business Owner',
      sublabel: 'Generate invite-only membership link',
      icon: Sparkles,
      color: colors.accentBlue,
      bgColor: colors.accentBlueLight,
      action: () => {
        closeDrawer();
        Alert.alert(
          'Invite Link Generated',
          `Exclusive Bengal Business Council onboarding link copied: https://bengalbusinesscouncil.com/join?ref=${currentUser.id}`
        );
      },
    },
    {
      id: 'settings',
      label: 'App Settings & Privacy',
      sublabel: 'Notifications & security preferences',
      icon: Settings,
      color: colors.textSecondary,
      bgColor: colors.cardBgElevated,
      action: () => {
        closeDrawer();
        Alert.alert('Settings', 'Bengal Business Council Executive App v1.0.0 (POC Edition). All systems operational.');
      },
    },
  ];

  return (
    <Modal visible={showDrawer} transparent animationType="fade" onRequestClose={closeDrawer}>
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={closeDrawer} />

        <View style={styles.drawerSheet}>
          {/* Header User Profile Banner */}
          <View style={styles.profileHeader}>
            <View style={styles.crestRow}>
              <View style={styles.crestBadge}>
                <Text style={styles.crestBadgeText}>BBC</Text>
              </View>
              <Text style={styles.councilTitle}>BENGAL BUSINESS COUNCIL</Text>
              <TouchableOpacity style={styles.closeBtn} onPress={closeDrawer}>
                <X color={colors.textPrimary} size={18} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.userProfileRow}
              onPress={() => {
                closeDrawer();
                onNavigate('Profile');
              }}
            >
              <Image source={{ uri: currentUser.avatar }} style={styles.avatar} />
              <View style={styles.userInfo}>
                <View style={styles.nameRow}>
                  <Text style={styles.userName}>{currentUser.name}</Text>
                  <ShieldCheck color={colors.emerald} size={14} />
                </View>
                <Text style={styles.userDesignation} numberOfLines={1}>
                  {currentUser.designation}
                </Text>
                <Text style={styles.userCompany} numberOfLines={1}>
                  {currentUser.companyName}
                </Text>
                <View style={styles.tierPill}>
                  <Text style={styles.tierPillText}>{currentUser.membershipTier}</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>

          {/* Quick Metrics Bar inside Drawer */}
          <View style={styles.drawerMetricsRow}>
            <View style={styles.metricItem}>
              <Text style={styles.metricNumber}>{currentUser.stats.oneToOneCount}</Text>
              <Text style={styles.metricLabel}>1-to-1s</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricItem}>
              <Text style={styles.metricNumber}>{currentUser.stats.referralsGiven}</Text>
              <Text style={styles.metricLabel}>Given</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricItem}>
              <Text style={styles.metricCrimson}>₹ {(currentUser.stats.businessValueInLakhs / 100).toFixed(1)} Cr</Text>
              <Text style={styles.metricLabel}>Business</Text>
            </View>
          </View>

          {/* Menu Items List */}
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.menuScroll}>
            <Text style={styles.menuSectionHeader}>EXECUTIVE NAVIGATION</Text>
            {menuItems.map(item => {
              const Icon = item.icon;
              return (
                <TouchableOpacity
                  key={item.id}
                  style={styles.menuItem}
                  onPress={item.action}
                  activeOpacity={0.7}
                >
                  <View style={[styles.menuIconBox, { backgroundColor: item.bgColor }]}>
                    <Icon color={item.color} size={18} />
                  </View>
                  <View style={styles.menuTextCol}>
                    <Text style={styles.menuTitle}>{item.label}</Text>
                    <Text style={styles.menuSub}>{item.sublabel}</Text>
                  </View>
                  <ChevronRight color={colors.textMuted} size={16} />
                </TouchableOpacity>
              );
            })}

            {/* Secretariat Information Box */}
            <View style={styles.secretariatBox}>
              <View style={styles.secHeader}>
                <Building color={colors.crimson} size={14} />
                <Text style={styles.secTitle}>BBC SECRETARIAT</Text>
              </View>
              <Text style={styles.secText}>
                Kolkata Headquarters • Salt Lake Sector V
              </Text>
              <Text style={styles.secContact}>
                secretariat@bengalbusinesscouncil.com
              </Text>
            </View>

            {/* Logout / Switch Account */}
            <TouchableOpacity
              style={styles.logoutBtn}
              onPress={() => {
                closeDrawer();
                Alert.alert('Session Active', 'You are logged into verified Bengal Business Council Executive profile.');
              }}
            >
              <LogOut color={colors.crimson} size={16} />
              <Text style={styles.logoutText}>Executive Member Logged In</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
  },
  drawerSheet: {
    width: width * 0.84,
    backgroundColor: colors.cardBg,
    height: '100%',
    borderRightWidth: 1,
    borderRightColor: colors.cardBorder,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
  },
  profileHeader: {
    backgroundColor: colors.cardBgElevated,
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  crestRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  crestBadge: {
    backgroundColor: colors.crimson,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  crestBadgeText: {
    color: colors.white,
    fontWeight: '900',
    fontSize: 10,
  },
  councilTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 0.8,
    flex: 1,
    marginLeft: 8,
  },
  closeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.cardBg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  userProfileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 2,
    borderColor: colors.crimson,
  },
  userInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  userName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  userDesignation: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1,
  },
  userCompany: {
    fontSize: 11.5,
    fontWeight: '700',
    color: colors.primary,
    marginTop: 2,
  },
  tierPill: {
    backgroundColor: colors.crimsonLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  tierPillText: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.crimson,
  },
  drawerMetricsRow: {
    flexDirection: 'row',
    backgroundColor: colors.cardBg,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  metricItem: {
    alignItems: 'center',
  },
  metricNumber: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  metricCrimson: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.crimson,
  },
  metricLabel: {
    fontSize: 9.5,
    color: colors.textMuted,
    marginTop: 1,
  },
  metricDivider: {
    width: 1,
    height: 20,
    backgroundColor: colors.cardBorder,
  },
  menuScroll: {
    padding: 16,
    paddingBottom: 40,
  },
  menuSectionHeader: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.textSecondary,
    letterSpacing: 1,
    marginBottom: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBgElevated,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  menuIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuTextCol: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  menuSub: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2,
  },
  secretariatBox: {
    backgroundColor: colors.cardBgElevated,
    borderRadius: 12,
    padding: 12,
    marginTop: 10,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  secHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  secTitle: {
    fontSize: 10.5,
    fontWeight: '800',
    color: colors.crimson,
    letterSpacing: 0.5,
  },
  secText: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  secContact: {
    fontSize: 10.5,
    color: colors.primary,
    fontWeight: '600',
    marginTop: 2,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: colors.crimsonLight,
    borderRadius: 10,
    gap: 8,
  },
  logoutText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.crimson,
  },
});
