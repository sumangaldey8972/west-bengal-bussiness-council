import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { colors } from '../theme/colors';

const { width } = Dimensions.get('window');

interface SkeletonBoxProps {
  width: number | string;
  height: number;
  borderRadius?: number;
  style?: any;
}

export const SkeletonBox: React.FC<SkeletonBoxProps> = ({
  width: boxWidth,
  height,
  borderRadius = 6,
  style,
}) => {
  const pulseAnim = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.85,
          duration: 750,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.35,
          duration: 750,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [pulseAnim]);

  return (
    <Animated.View
      style={[
        {
          width: boxWidth as any,
          height,
          borderRadius,
          backgroundColor: '#E2E8F0',
          opacity: pulseAnim,
        },
        style,
      ]}
    />
  );
};

export const HomeScreenSkeleton: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Stories / Chapter Highlights Row */}
      <View style={styles.storiesRow}>
        {[1, 2, 3, 4, 5].map(i => (
          <View key={i} style={styles.storyItem}>
            <SkeletonBox width={62} height={62} borderRadius={31} />
            <SkeletonBox width={50} height={10} borderRadius={5} style={{ marginTop: 6 }} />
          </View>
        ))}
      </View>

      {/* KPI Dashboard Card Skeleton */}
      <View style={styles.cardContainer}>
        <View style={styles.kpiHeader}>
          <SkeletonBox width={90} height={12} borderRadius={6} />
          <SkeletonBox width={140} height={16} borderRadius={8} style={{ marginTop: 6 }} />
        </View>

        <View style={styles.kpiGrid}>
          <View style={styles.kpiBox}>
            <SkeletonBox width={32} height={32} borderRadius={16} />
            <SkeletonBox width={80} height={22} borderRadius={6} style={{ marginTop: 10 }} />
            <SkeletonBox width={100} height={12} borderRadius={6} style={{ marginTop: 6 }} />
          </View>
          <View style={styles.kpiBox}>
            <SkeletonBox width={32} height={32} borderRadius={16} />
            <SkeletonBox width={40} height={22} borderRadius={6} style={{ marginTop: 10 }} />
            <SkeletonBox width={90} height={12} borderRadius={6} style={{ marginTop: 6 }} />
          </View>
        </View>

        <View style={styles.kpiBottomRow}>
          <SkeletonBox width="100%" height={56} borderRadius={12} />
        </View>
      </View>

      {/* Quick Action Chips Skeleton */}
      <View style={styles.quickActionsRow}>
        {[1, 2, 3, 4].map(i => (
          <SkeletonBox key={i} width={(width - 48) / 4} height={42} borderRadius={10} />
        ))}
      </View>

      {/* Filter Tabs Skeleton */}
      <View style={styles.filterTabsRow}>
        {[1, 2, 3, 4].map(i => (
          <SkeletonBox key={i} width={88} height={30} borderRadius={15} style={{ marginRight: 8 }} />
        ))}
      </View>

      {/* Feed Post Card Skeletons */}
      {[1, 2].map(i => (
        <View key={i} style={styles.postCard}>
          <View style={styles.postHeader}>
            <SkeletonBox width={42} height={42} borderRadius={21} />
            <View style={styles.postHeaderText}>
              <SkeletonBox width={150} height={14} borderRadius={7} />
              <SkeletonBox width={100} height={11} borderRadius={5} style={{ marginTop: 5 }} />
            </View>
          </View>

          <SkeletonBox width="100%" height={14} borderRadius={7} style={{ marginTop: 12 }} />
          <SkeletonBox width="85%" height={14} borderRadius={7} style={{ marginTop: 6 }} />
          <SkeletonBox width="60%" height={14} borderRadius={7} style={{ marginTop: 6 }} />

          <SkeletonBox width="100%" height={160} borderRadius={12} style={{ marginTop: 12 }} />

          <View style={styles.postFooter}>
            <SkeletonBox width={70} height={24} borderRadius={6} />
            <SkeletonBox width={70} height={24} borderRadius={6} />
            <SkeletonBox width={70} height={24} borderRadius={6} />
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 8,
    paddingBottom: 40,
  },
  storiesRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 16,
  },
  storyItem: {
    alignItems: 'center',
  },
  cardContainer: {
    backgroundColor: colors.cardBg,
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginBottom: 14,
  },
  kpiHeader: {
    marginBottom: 12,
  },
  kpiGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  kpiBox: {
    flex: 1,
    backgroundColor: colors.cardBgElevated,
    borderRadius: 12,
    padding: 12,
  },
  kpiBottomRow: {
    marginTop: 2,
  },
  quickActionsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 14,
  },
  filterTabsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  postCard: {
    backgroundColor: colors.cardBg,
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginBottom: 14,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  postHeaderText: {
    flex: 1,
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
  },
});
