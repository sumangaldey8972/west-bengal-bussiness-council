import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { X, Send, Building2 } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { useApp } from '../context/AppContext';

export const CommentsModal: React.FC = () => {
  const { showCommentsModal, selectedPostForComments, closeComments, comments, addComment } = useApp();
  const [commentText, setCommentText] = useState('');

  if (!showCommentsModal || !selectedPostForComments) return null;

  const postComments = comments[selectedPostForComments.id] || [];

  const handleSend = () => {
    if (!commentText.trim()) return;
    addComment(selectedPostForComments.id, commentText);
    setCommentText('');
  };

  return (
    <Modal
      visible={showCommentsModal}
      transparent
      animationType="slide"
      onRequestClose={closeComments}
    >
      <View style={styles.overlay}>
        <View style={styles.sheetContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.headerBadge}>COUNCIL DISCUSSION</Text>
              <Text style={styles.headerTitle}>Comments & Inquiries ({postComments.length})</Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={closeComments}>
              <X color={colors.textPrimary} size={20} />
            </TouchableOpacity>
          </View>

          {/* Original Post Snippet */}
          <View style={styles.postSnippetBox}>
            <Text style={styles.snippetAuthor}>{selectedPostForComments.authorName}:</Text>
            <Text style={styles.snippetContent} numberOfLines={2}>
              {selectedPostForComments.content}
            </Text>
          </View>

          {/* Comments List */}
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.commentsList}>
            {postComments.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No responses yet. Be the first council member to reply!</Text>
              </View>
            ) : (
              postComments.map(c => (
                <View key={c.id} style={styles.commentItem}>
                  <Image source={{ uri: c.authorAvatar }} style={styles.avatar} />
                  <View style={styles.commentContent}>
                    <View style={styles.authorRow}>
                      <Text style={styles.authorName}>{c.authorName}</Text>
                      <Text style={styles.createdAt}>{c.createdAt}</Text>
                    </View>
                    <View style={styles.companyRow}>
                      <Building2 color={colors.primary} size={10} />
                      <Text style={styles.authorCompany}>{c.authorCompany}</Text>
                    </View>
                    <Text style={styles.commentText}>{c.text}</Text>
                  </View>
                </View>
              ))
            )}
          </ScrollView>

          {/* Input Bar */}
          <View style={styles.inputBar}>
            <TextInput
              style={styles.textInput}
              placeholder="Write a council response or query..."
              placeholderTextColor={colors.textMuted}
              value={commentText}
              onChangeText={setCommentText}
            />
            <TouchableOpacity
              style={[styles.sendBtn, !commentText.trim() && styles.sendBtnDisabled]}
              onPress={handleSend}
              disabled={!commentText.trim()}
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
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: colors.cardBg,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    height: '75%',
    paddingBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  headerBadge: {
    fontSize: 9.5,
    fontWeight: '800',
    color: colors.crimson,
    letterSpacing: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.cardBgElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  postSnippetBox: {
    backgroundColor: colors.cardBgElevated,
    padding: 10,
    marginHorizontal: 16,
    marginTop: 10,
    borderRadius: 10,
    borderLeftWidth: 3,
    borderLeftColor: colors.crimson,
  },
  snippetAuthor: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 2,
  },
  snippetContent: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  commentsList: {
    padding: 16,
    gap: 12,
  },
  emptyState: {
    paddingVertical: 30,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
  },
  commentItem: {
    flexDirection: 'row',
    gap: 10,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  commentContent: {
    flex: 1,
    backgroundColor: colors.cardBgElevated,
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  authorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  authorName: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  createdAt: {
    fontSize: 10,
    color: colors.textMuted,
  },
  companyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6,
  },
  authorCompany: {
    fontSize: 10.5,
    color: colors.primary,
    fontWeight: '600',
  },
  commentText: {
    fontSize: 12.5,
    color: colors.textPrimary,
    lineHeight: 18,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
    gap: 10,
  },
  textInput: {
    flex: 1,
    backgroundColor: colors.cardBgElevated,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    paddingHorizontal: 14,
    paddingVertical: 9,
    color: colors.textPrimary,
    fontSize: 13,
  },
  sendBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.crimson,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    opacity: 0.4,
  },
});
