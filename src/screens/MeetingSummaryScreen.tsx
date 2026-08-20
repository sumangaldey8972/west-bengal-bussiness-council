import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import {
  Calendar,
  Users2,
  TrendingUp,
  FileSpreadsheet,
  Download,
  ChevronDown,
  ChevronUp,
} from 'lucide-react-native';
import { colors } from '../theme/colors';
import { useApp } from '../context/AppContext';
import { Header } from '../components/Header';

export const MeetingSummaryScreen: React.FC = () => {
  const { meetingSummaries } = useApp();
  const [expandedMeetingId, setExpandedMeetingId] = useState<string>(meetingSummaries[0]?.id || '');

  const toggleExpand = (id: string) => {
    setExpandedMeetingId(prev => (prev === id ? '' : id));
  };

  const handleDownloadMinutes = (title: string) => {
    Alert.alert(
      'Minutes of Meeting Downloaded',
      `Official PDF MoM for "${title}" has been saved to your downloads.`
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header showSearchBar={false} />

      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        {/* Banner Section */}
        <View style={styles.heroCard}>
          <View style={styles.badgeRow}>
            <FileSpreadsheet color={colors.crimson} size={16} />
            <Text style={styles.badgeText}>BENGAL BUSINESS COUNCIL ARCHIVES</Text>
          </View>
          <Text style={styles.heroTitle}>Meeting Summaries & Minutes</Text>
          <Text style={styles.heroSubtitle}>
            Official bi-weekly conclave records, business statistics, referrals exchanged, and ratified policy resolutions.
          </Text>
        </View>

        {/* Meeting Summaries List */}
        <View style={styles.meetingsList}>
          {meetingSummaries.map(item => {
            const isExpanded = expandedMeetingId === item.id;

            return (
              <View key={item.id} style={styles.meetingCard}>
                {/* Meeting Header */}
                <TouchableOpacity
                  style={styles.meetingHeader}
                  onPress={() => toggleExpand(item.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.headerLeft}>
                    <View style={styles.chapterBadge}>
                      <Text style={styles.chapterBadgeText}>{item.chapter}</Text>
                    </View>
                    <Text style={styles.meetingTitle}>{item.title}</Text>
                    <View style={styles.dateTimeRow}>
                      <Calendar color={colors.crimson} size={12} />
                      <Text style={styles.dateTimeText}>{item.date}</Text>
                    </View>
                  </View>

                  <View style={styles.expandIconBox}>
                    {isExpanded ? (
                      <ChevronUp color={colors.primary} size={18} />
                    ) : (
                      <ChevronDown color={colors.textSecondary} size={18} />
                    )}
                  </View>
                </TouchableOpacity>

                {/* KPI Metrics Box for this Meeting */}
                <View style={styles.kpiRow}>
                  <View style={styles.kpiCol}>
                    <View style={styles.kpiIconBadge}>
                      <Users2 color={colors.accentBlue} size={14} />
                    </View>
                    <View>
                      <Text style={styles.kpiVal}>{item.attendeesCount}</Text>
                      <Text style={styles.kpiLbl}>CEOs Present</Text>
                    </View>
                  </View>

                  <View style={styles.divider} />

                  <View style={styles.kpiCol}>
                    <View style={styles.kpiIconBadge}>
                      <TrendingUp color={colors.emerald} size={14} />
                    </View>
                    <View>
                      <Text style={styles.kpiValEmerald}>{item.totalBusinessAnnounced}</Text>
                      <Text style={styles.kpiLbl}>TYFB Value</Text>
                    </View>
                  </View>
                </View>

                {/* Expanded Details */}
                {isExpanded && (
                  <View style={styles.expandedBody}>
                    {/* Key Highlights */}
                    <View style={styles.pointsSection}>
                      <Text style={styles.pointsTitle}>KEY RESOLUTIONS & HIGHLIGHTS</Text>
                      {item.keyHighlights.map((pt, idx) => (
                        <View key={idx} style={styles.bulletItem}>
                          <Text style={styles.bulletDot}>•</Text>
                          <Text style={styles.bulletText}>{pt}</Text>
                        </View>
                      ))}
                    </View>

                    {/* Next Steps */}
                    {item.nextSteps && item.nextSteps.length > 0 && (
                      <View style={styles.pointsSection}>
                        <Text style={styles.pointsTitle}>ACTION ITEMS & NEXT STEPS</Text>
                        {item.nextSteps.map((step, idx) => (
                          <View key={idx} style={styles.bulletItem}>
                            <Text style={styles.bulletDot}>➔</Text>
                            <Text style={styles.bulletText}>{step}</Text>
                          </View>
                        ))}
                      </View>
                    )}

                    {/* Download MoM PDF Button */}
                    <TouchableOpacity
                      style={styles.downloadPdfBtn}
                      onPress={() => handleDownloadMinutes(item.title)}
                      activeOpacity={0.8}
                    >
                      <Download color={colors.crimson} size={16} />
                      <Text style={styles.downloadPdfText}>Download Signed MoM Document (PDF)</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.cardBg,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  heroCard: {
    backgroundColor: colors.cardBg,
    margin: 16,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  badgeText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: colors.crimson,
    letterSpacing: 1,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  heroSubtitle: {
    fontSize: 12.5,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  meetingsList: {
    paddingHorizontal: 16,
    paddingBottom: 30,
    gap: 14,
  },
  meetingCard: {
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  meetingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  headerLeft: {
    flex: 1,
    marginRight: 10,
  },
  chapterBadge: {
    backgroundColor: colors.crimsonLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  chapterBadgeText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: colors.crimson,
  },
  meetingTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  dateTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  dateTimeText: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  expandIconBox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.cardBgElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  kpiRow: {
    flexDirection: 'row',
    backgroundColor: colors.cardBgElevated,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  kpiCol: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    justifyContent: 'center',
  },
  kpiIconBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.cardBg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  kpiVal: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  kpiValEmerald: {
    fontSize: 12.5,
    fontWeight: '800',
    color: colors.emerald,
  },
  kpiLbl: {
    fontSize: 9,
    color: colors.textMuted,
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: colors.cardBorder,
    marginHorizontal: 4,
  },
  expandedBody: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
  },
  pointsSection: {
    marginBottom: 12,
  },
  pointsTitle: {
    fontSize: 9.5,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  bulletItem: {
    flexDirection: 'row',
    marginBottom: 4,
    gap: 6,
  },
  bulletDot: {
    color: colors.crimson,
    fontWeight: '800',
  },
  bulletText: {
    flex: 1,
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 17,
  },
  downloadPdfBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.crimsonLight,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.crimsonBorder,
    gap: 6,
    marginTop: 4,
  },
  downloadPdfText: {
    color: colors.crimson,
    fontSize: 12,
    fontWeight: '700',
  },
});
