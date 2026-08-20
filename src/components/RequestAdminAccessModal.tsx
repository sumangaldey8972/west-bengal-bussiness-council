import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
} from 'react-native';
import { X, ShieldAlert, CheckCircle2, Lock, FileCheck } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { useApp } from '../context/AppContext';

export const RequestAdminAccessModal: React.FC = () => {
  const {
    showRequestAdminAccessModal,
    selectedUserForAdminAccess,
    closeRequestAdminAccess,
    requestAdminContactAccess,
    requestedAdminAccessIds,
  } = useApp();

  const [reason, setReason] = useState('High-value commercial RFP & B2B procurement partnership inquiry');

  if (!showRequestAdminAccessModal || !selectedUserForAdminAccess) return null;

  const isAlreadyRequested = requestedAdminAccessIds.includes(selectedUserForAdminAccess.id);

  const handleSubmit = () => {
    requestAdminContactAccess(selectedUserForAdminAccess.id, reason);
    Alert.alert(
      'Request Sent',
      `Your request to connect with ${selectedUserForAdminAccess.name} (${selectedUserForAdminAccess.companyName}) has been sent to the Council team. We will introduce you via email or phone.`
    );
    closeRequestAdminAccess();
  };

  return (
    <Modal
      visible={showRequestAdminAccessModal}
      transparent
      animationType="slide"
      onRequestClose={closeRequestAdminAccess}
    >
      <View style={styles.overlay}>
        <View style={styles.sheetContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.headerBadge}>COUNCIL PROTOCOL</Text>
              <Text style={styles.headerTitle}>Request an Introduction</Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={closeRequestAdminAccess}>
              <X color={colors.textPrimary} size={20} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.body}>
            {/* Target Member Card */}
            <View style={styles.targetMemberCard}>
              <Image source={{ uri: selectedUserForAdminAccess.avatar }} style={styles.avatar} />
              <View style={styles.targetInfo}>
                <Text style={styles.memberName}>{selectedUserForAdminAccess.name}</Text>
                <Text style={styles.designation}>{selectedUserForAdminAccess.designation}</Text>
                <Text style={styles.company}>{selectedUserForAdminAccess.companyName}</Text>
                <Text style={styles.chapter}>
                  {selectedUserForAdminAccess.chapter} • Member since {selectedUserForAdminAccess.yearJoined}
                </Text>
              </View>
            </View>

            {/* Confidentiality Notice */}
            <View style={styles.securityNotice}>
              <Lock color={colors.accentBlue} size={18} />
              <View style={styles.noticeTextCol}>
                <Text style={styles.noticeTitle}>Member Privacy Protection</Text>
                <Text style={styles.noticeBody}>
                  To protect member privacy, direct phone numbers and company documents are shared through Council introductions.
                </Text>
              </View>
            </View>

            {/* Requested Information Checklist */}
            <View style={styles.checklistCard}>
              <Text style={styles.checkCardTitle}>DETAILS YOU WILL RECEIVE</Text>
              <View style={styles.checkItem}>
                <FileCheck color={colors.emerald} size={16} />
                <Text style={styles.checkItemText}>Direct phone number & email address</Text>
              </View>
              <View style={styles.checkItem}>
                <FileCheck color={colors.emerald} size={16} />
                <Text style={styles.checkItemText}>Verified GST details & company documents</Text>
              </View>
              <View style={styles.checkItem}>
                <FileCheck color={colors.emerald} size={16} />
                <Text style={styles.checkItemText}>Arranged 1-to-1 business meeting</Text>
              </View>
            </View>

            {/* Reason Field */}
            <View style={styles.fieldGroup}>
              <Text style={styles.inputLabel}>WHY DO YOU WANT TO CONNECT?</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={reason}
                onChangeText={setReason}
                placeholder="Explain your business inquiry or project requirement..."
                placeholderTextColor={colors.textMuted}
                multiline
                numberOfLines={3}
              />
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[styles.submitBtn, isAlreadyRequested && styles.submitBtnDisabled]}
              onPress={handleSubmit}
              disabled={isAlreadyRequested}
              activeOpacity={0.8}
            >
              {isAlreadyRequested ? (
                <>
                  <CheckCircle2 color={colors.white} size={18} />
                  <Text style={styles.submitBtnText}>Request is Being Reviewed</Text>
                </>
              ) : (
                <>
                  <ShieldAlert color={colors.white} size={18} />
                  <Text style={styles.submitBtnText}>Send Introduction Request</Text>
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
    maxHeight: '90%',
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
    fontSize: 16.5,
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
  targetMemberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBgElevated,
    borderRadius: 14,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    gap: 12,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: colors.crimson,
  },
  targetInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  designation: {
    fontSize: 11.5,
    color: colors.textSecondary,
    marginTop: 1,
  },
  company: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
    marginTop: 2,
  },
  chapter: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 2,
  },
  securityNotice: {
    flexDirection: 'row',
    backgroundColor: colors.accentBlueLight,
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.accentBlueBorder,
    gap: 10,
  },
  noticeTextCol: {
    flex: 1,
  },
  noticeTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.accentBlueDark,
  },
  noticeBody: {
    fontSize: 11,
    color: colors.textSecondary,
    lineHeight: 16,
    marginTop: 2,
  },
  checklistCard: {
    backgroundColor: colors.cardBgElevated,
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  checkCardTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
  },
  checkItemText: {
    fontSize: 12,
    color: colors.textPrimary,
    flex: 1,
  },
  fieldGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: colors.cardBgElevated,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: colors.textPrimary,
    fontSize: 13,
  },
  textArea: {
    height: 70,
    textAlignVertical: 'top',
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.crimson,
    borderRadius: 12,
    paddingVertical: 14,
    gap: 8,
    marginTop: 6,
  },
  submitBtnDisabled: {
    backgroundColor: colors.emerald,
  },
  submitBtnText: {
    color: colors.white,
    fontSize: 13.5,
    fontWeight: '700',
  },
});
