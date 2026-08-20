import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Home, Users, Search, Briefcase, MessageSquare } from 'lucide-react-native';
import { colors } from '../theme/colors';

import { HomeScreen } from '../screens/HomeScreen';
import { CommunityScreen } from '../screens/CommunityScreen';
import { SearchScreen } from '../screens/SearchScreen';
import { BusinessDeskScreen } from '../screens/BusinessDeskScreen';
import { MessagesScreen } from '../screens/MessagesScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { MeetingSummaryScreen } from '../screens/MeetingSummaryScreen';
import { EventsScreen } from '../screens/EventsScreen';

import { StoryViewerModal } from '../components/StoryViewerModal';
import { DigitalBusinessCardModal } from '../components/DigitalBusinessCardModal';
import { LogOneToOneModal } from '../components/LogOneToOneModal';
import { GiveReferralModal } from '../components/GiveReferralModal';
import { RecordDealModal } from '../components/RecordDealModal';
import { PostCreationModal } from '../components/PostCreationModal';
import { CommentsModal } from '../components/CommentsModal';
import { RequestAdminAccessModal } from '../components/RequestAdminAccessModal';
import { DrawerModal } from '../components/DrawerModal';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
export const navigationRef = createNavigationContainerRef();

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: colors.crimson,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: styles.tabBarLabel,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrapper, focused && styles.activeIconWrapper]}>
              <Home color={color} size={20} strokeWidth={focused ? 2.5 : 2} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Community"
        component={CommunityScreen}
        options={{
          tabBarLabel: 'Chapters',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrapper, focused && styles.activeIconWrapper]}>
              <Users color={color} size={20} strokeWidth={focused ? 2.5 : 2} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarLabel: 'Directory',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrapper, focused && styles.activeIconWrapper]}>
              <Search color={color} size={20} strokeWidth={focused ? 2.5 : 2} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="BusinessDesk"
        component={BusinessDeskScreen}
        options={{
          tabBarLabel: 'Business Desk',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrapper, focused && styles.activeIconWrapper]}>
              <Briefcase color={color} size={20} strokeWidth={focused ? 2.5 : 2} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Messages"
        component={MessagesScreen}
        options={{
          tabBarLabel: 'Messages',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrapper, focused && styles.activeIconWrapper]}>
              <MessageSquare color={color} size={20} strokeWidth={focused ? 2.5 : 2} />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export const AppNavigator: React.FC = () => {
  const handleDrawerNavigate = (screenName: string) => {
    if (navigationRef.isReady()) {
      navigationRef.navigate(screenName as never);
    }
  };

  return (
    <NavigationContainer ref={navigationRef}>
      <View style={styles.rootContainer}>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            animation: 'fade_from_bottom',
          }}
        >
          <Stack.Screen name="MainTabs" component={MainTabs} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="MeetingSummary" component={MeetingSummaryScreen} />
          <Stack.Screen name="Events" component={EventsScreen} />
        </Stack.Navigator>

        {/* Global Modals */}
        <StoryViewerModal />
        <DigitalBusinessCardModal />
        <LogOneToOneModal />
        <GiveReferralModal />
        <RecordDealModal />
        <PostCreationModal />
        <CommentsModal />
        <RequestAdminAccessModal />
        <DrawerModal onNavigate={handleDrawerNavigate} />
      </View>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  tabBar: {
    backgroundColor: colors.cardBg,
    borderTopColor: colors.cardBorder,
    borderTopWidth: 1,
    height: Platform.OS === 'ios' ? 84 : 64,
    paddingBottom: Platform.OS === 'ios' ? 24 : 8,
    paddingTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 8,
  },
  tabBarLabel: {
    fontSize: 10.5,
    fontWeight: '700',
    marginTop: 2,
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
    borderRadius: 8,
  },
  activeIconWrapper: {
    backgroundColor: colors.crimsonLight,
  },
});
