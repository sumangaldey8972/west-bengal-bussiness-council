import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { X, Send, Sparkles, AlertCircle, FileText, Check } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { Post } from '../types';
import { useApp } from '../context/AppContext';

export const PostCreationModal: React.FC = () => {
  const { showCreatePostModal, closeCreatePost, createPost } = useApp();

  const [tag, setTag] = useState<Post['tag']>('B2B Requirement');
  const [content, setContent] = useState('');
  const [isUrgent, setIsUrgent] = useState(true);
  const [budgetOrValue, setBudgetOrValue] = useState('₹ 50 Lakhs - ₹ 1 Cr');
  const [hasAttachment, setHasAttachment] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!showCreatePostModal) return null;

  const handleSubmit = () => {
    if (!content.trim()) {
      Alert.alert('Please Enter Details', 'Please write the details of your post or business requirement.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      createPost(content.trim(), tag, isUrgent, budgetOrValue.trim() || undefined);
      setIsSubmitting(false);
      setContent('');
      closeCreatePost();
      Alert.alert('Post Published! 🚀', 'Your business post is now live on the Council feed.');
    }, 900);
  };

  const tags: Post['tag'][] = ['B2B Requirement', 'Deal Won', 'Partnership Ask', 'General'];

  return (
    <Modal
      visible={showCreatePostModal}
      transparent
      animationType="slide"
      onRequestClose={closeCreatePost}
    >
      <View style={styles.overlay}>
        <View style={styles.sheetContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.headerBadge}>BENGAL BUSINESS COUNCIL FEED</Text>
              <Text style={styles.headerTitle}>Create a Post or Requirement</Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={closeCreatePost}>
              <X color={colors.textPrimary} size={20} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.body}>
            {/* Category / Tag Selector */}
            <Text style={styles.inputLabel}>POST CATEGORY</Text>
            <View style={styles.tagsRow}>
              {tags.map(t => {
                const isSelected = tag === t;
                return (
                  <TouchableOpacity
                    key={t}
                    style={[styles.tagPill, isSelected && styles.tagPillSelected]}
                    onPress={() => setTag(t)}
                  >
                    <Sparkles color={isSelected ? colors.crimson : colors.textMuted} size={13} />
                    <Text style={[styles.tagText, isSelected && styles.tagTextSelected]}>{t}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Urgent Tag Toggle */}
            {tag === 'B2B Requirement' && (
              <TouchableOpacity
                style={[styles.urgentToggleBox, isUrgent && styles.urgentToggleBoxActive]}
                onPress={() => setIsUrgent(!isUrgent)}
              >
                <View style={styles.urgentToggleLeft}>
                  <AlertCircle color={isUrgent ? colors.crimson : colors.textMuted} size={18} />
                  <View>
                    <Text style={[styles.urgentTitle, isUrgent && styles.urgentTitleActive]}>
                      Urgent Requirement
                    </Text>
                    <Text style={styles.urgentSub}>
                      Highlights this post to members in your industry
                    </Text>
                  </View>
                </View>
                <View style={[styles.checkbox, isUrgent && styles.checkboxActive]}>
                  {isUrgent && <Check color={colors.white} size={12} strokeWidth={3} />}
                </View>
              </TouchableOpacity>
            )}

            {/* Budget / Value Input */}
            <View style={styles.fieldGroup}>
              <Text style={styles.inputLabel}>BUDGET OR VALUE (OPTIONAL)</Text>
              <TextInput
                style={styles.textInput}
                value={budgetOrValue}
                onChangeText={setBudgetOrValue}
                placeholder="e.g. ₹ 50 Lakhs - ₹ 1 Cr"
                placeholderTextColor={colors.textMuted}
              />
            </View>

            {/* Post Content */}
            <View style={styles.fieldGroup}>
              <Text style={styles.inputLabel}>POST DETAILS</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={content}
                onChangeText={setContent}
                placeholder="Describe what product, service, or vendor you are looking for..."
                placeholderTextColor={colors.textMuted}
                multiline
                numberOfLines={5}
              />
            </View>

            {/* Document Attachment Simulation */}
            <TouchableOpacity
              style={styles.attachmentBox}
              onPress={() => setHasAttachment(!hasAttachment)}
            >
              <FileText color={hasAttachment ? colors.crimson : colors.textMuted} size={20} />
              <View style={styles.attachInfo}>
                <Text style={[styles.attachTitle, hasAttachment && styles.attachTitleActive]}>
                  {hasAttachment ? 'Specification_Document.pdf attached' : '+ Attach PDF / Document (Optional)'}
                </Text>
                <Text style={styles.attachMeta}>
                  {hasAttachment ? '2.4 MB • Ready to upload' : 'Max 10 MB (PDF format)'}
                </Text>
              </View>
              <View style={[styles.checkbox, hasAttachment && styles.checkboxActive]}>
                {hasAttachment && <Check color={colors.white} size={12} strokeWidth={3} />}
              </View>
            </TouchableOpacity>

            {/* Submit Button */}
            <TouchableOpacity
              style={[styles.submitBtn, isSubmitting && { opacity: 0.75 }]}
              onPress={handleSubmit}
              disabled={isSubmitting}
              activeOpacity={0.8}
            >
              {isSubmitting ? (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <ActivityIndicator size="small" color={colors.white} />
                  <Text style={styles.submitBtnText}>Publishing Post to Feed...</Text>
                </View>
              ) : (
                <>
                  <Send color={colors.white} size={16} />
                  <Text style={styles.submitBtnText}>Publish Post to Council</Text>
                </>
              )}
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
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: colors.cardBg,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    maxHeight: '92%',
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 14,
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
    fontSize: 17,
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
  body: {
    padding: 18,
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  tagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBgElevated,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    gap: 6,
  },
  tagPillSelected: {
    backgroundColor: colors.crimsonLight,
    borderColor: colors.crimson,
  },
  tagText: {
    fontSize: 11.5,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  tagTextSelected: {
    color: colors.crimson,
    fontWeight: '700',
  },
  urgentToggleBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.cardBgElevated,
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  urgentToggleBoxActive: {
    backgroundColor: colors.crimsonLight,
    borderColor: colors.crimsonBorder,
  },
  urgentToggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  urgentTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  urgentTitleActive: {
    color: colors.crimson,
  },
  urgentSub: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 1,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.cardBg,
  },
  checkboxActive: {
    backgroundColor: colors.crimson,
    borderColor: colors.crimson,
  },
  fieldGroup: {
    marginBottom: 14,
  },
  textInput: {
    backgroundColor: colors.cardBgElevated,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: colors.textPrimary,
    fontSize: 13.5,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  attachmentBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBgElevated,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    gap: 10,
  },
  attachInfo: {
    flex: 1,
  },
  attachTitle: {
    fontSize: 12.5,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  attachTitleActive: {
    color: colors.textPrimary,
  },
  attachMeta: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 2,
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.crimson,
    borderRadius: 12,
    paddingVertical: 14,
    gap: 8,
  },
  submitBtnText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
