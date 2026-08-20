import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Image,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from 'react-native';
import { X, Send, ShieldCheck, CalendarPlus, Sparkles, Building2 } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { useApp } from '../context/AppContext';

const { width, height } = Dimensions.get('window');

export const StoryViewerModal: React.FC = () => {
  const { activeStory, showStoryViewer, closeStory, openLogOneToOne, users } = useApp();
  const [replyText, setReplyText] = useState('');
  const [progress, setProgress] = useState(0);

  const storyUser = activeStory ? users.find(u => u.id === activeStory.userId) : null;

  useEffect(() => {
    if (!showStoryViewer) {
      setProgress(0);
      return;
    }

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 1) {
          clearInterval(interval);
          closeStory();
          return 1;
        }
        return prev + 0.05;
      });
    }, 250);

    return () => clearInterval(interval);
  }, [showStoryViewer]);

  if (!activeStory) return null;

  const handleSendReply = () => {
    if (replyText.trim()) {
      alert(`Message sent to ${activeStory.userName}!`);
      setReplyText('');
      closeStory();
    }
  };

  return (
    <Modal
      visible={showStoryViewer}
      transparent
      animationType="fade"
      onRequestClose={closeStory}
    >
      <View style={styles.overlay}>
        <View style={styles.storyCard}>
          {/* Top Progress Bar */}
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
          </View>

          {/* Header Row */}
          <View style={styles.headerRow}>
            <View style={styles.authorRow}>
              <Image source={{ uri: activeStory.userAvatar }} style={styles.avatar} />
              <View>
                <View style={styles.nameRow}>
                  <Text style={styles.authorName}>{activeStory.userName}</Text>
                  <View style={styles.verifiedBadge}>
                    <ShieldCheck color={colors.emerald} size={12} />
                  </View>
                </View>
                <View style={styles.companyRow}>
                  <Building2 color={colors.primary} size={11} />
                  <Text style={styles.companyName}>{activeStory.companyName}</Text>
                  <Text style={styles.timestamp}>• {activeStory.timestamp}</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity style={styles.closeBtn} onPress={closeStory}>
              <X color={colors.textPrimary} size={20} />
            </TouchableOpacity>
          </View>

          {/* Tag Pill */}
          <View style={styles.tagPillRow}>
            <View style={[styles.tagPill, { backgroundColor: activeStory.accentColor || colors.crimson }]}>
              <Sparkles color={colors.white} size={12} />
              <Text style={styles.tagPillText}>{activeStory.tag.toUpperCase()}</Text>
            </View>
          </View>

          {/* Story Content Area */}
          <View style={styles.contentBody}>
            <Text style={styles.storyTitle}>{activeStory.title}</Text>
            <Text style={styles.storyCaption}>{activeStory.caption}</Text>

            {/* Quick Action to Schedule 1-to-1 */}
            {storyUser && (
              <TouchableOpacity
                style={styles.schedule1to1Card}
                onPress={() => {
                  closeStory();
                  openLogOneToOne(storyUser);
                }}
                activeOpacity={0.8}
              >
                <CalendarPlus color={colors.crimson} size={18} />
                <Text style={styles.schedule1to1Text}>Schedule 1-to-1 with {activeStory.userName.split(' ')[0]}</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Bottom Reply Bar */}
          <View style={styles.replyBar}>
            <TextInput
              style={styles.replyInput}
              placeholder={`Send message to ${activeStory.userName.split(' ')[0]}...`}
              placeholderTextColor={colors.textMuted}
              value={replyText}
              onChangeText={setReplyText}
            />
            <TouchableOpacity
              style={[styles.sendBtn, !replyText.trim() && styles.sendBtnDisabled]}
              onPress={handleSendReply}
              disabled={!replyText.trim()}
            >
              <Send color={colors.white} size={16} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
  },
  storyCard: {
    width: width - 24,
    height: height * 0.78,
    backgroundColor: colors.cardBg,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: 18,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
  },
  progressBarBg: {
    height: 3,
    backgroundColor: colors.cardBorder,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 14,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.crimson,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: colors.crimson,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  authorName: {
    color: colors.textPrimary,
    fontSize: 14.5,
    fontWeight: '700',
  },
  verifiedBadge: {
    backgroundColor: colors.emeraldLight,
    borderRadius: 8,
    padding: 2,
  },
  companyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  companyName: {
    color: colors.primary,
    fontSize: 11.5,
    fontWeight: '600',
  },
  timestamp: {
    color: colors.textMuted,
    fontSize: 11,
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.cardBgElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagPillRow: {
    marginTop: 14,
  },
  tagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 6,
  },
  tagPillText: {
    color: colors.white,
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  contentBody: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 20,
  },
  storyTitle: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 30,
    marginBottom: 12,
    letterSpacing: 0.2,
  },
  storyCaption: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 23,
  },
  schedule1to1Card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.crimsonLight,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.crimsonBorder,
    marginTop: 24,
    gap: 10,
  },
  schedule1to1Text: {
    color: colors.crimson,
    fontSize: 13,
    fontWeight: '700',
  },
  replyBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 10,
  },
  replyInput: {
    flex: 1,
    backgroundColor: colors.cardBgElevated,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: colors.textPrimary,
    fontSize: 13.5,
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.crimson,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    opacity: 0.4,
  },
});
