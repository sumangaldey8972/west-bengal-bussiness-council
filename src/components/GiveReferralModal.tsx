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
  Image,
} from 'react-native';
import { X, UserCheck, DollarSign, Clock, FileText, Check } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { Referral } from '../types';
import { useApp } from '../context/AppContext';

export const GiveReferralModal: React.FC = () => {
  const {
    showGiveReferralModal,
    targetReferralUser,
    closeGiveReferral,
    users,
    currentUser,
    giveReferral,
  } = useApp();

  const otherUsers = users.filter(u => u.id !== currentUser.id);

  const [selectedUserId, setSelectedUserId] = useState<string>(
    targetReferralUser?.id || otherUsers[0]?.id || ''
  );
  const [clientName, setClientName] = useState('Debrup Sen (VP Procurement, Ambuja Neotia)');
  const [clientContact] = useState('+91 98301 55432 / debrup.sen@ambujaneotia.com');
  const [serviceNeeded, setServiceNeeded] = useState('Turnkey engineering consultancy & precision fabrication supply');
  const [estimatedValue, setEstimatedValue] = useState('₹ 35 Lakhs');
  const [urgency, setUrgency] = useState<Referral['urgency']>('Immediate');

  if (!showGiveReferralModal) return null;

  const handleSave = () => {
    giveReferral(selectedUserId, clientName, clientContact, serviceNeeded, estimatedValue, urgency);
    Alert.alert(
      'Referral Passed Successfully! 🤝',
      'The lead details have been securely shared with the member and recorded in your council referral desk.'
    );
    closeGiveReferral();
  };

  const selectedMember = users.find(u => u.id === selectedUserId) || otherUsers[0];

  return (
    <Modal
      visible={showGiveReferralModal}
      transparent
      animationType="slide"
      onRequestClose={closeGiveReferral}
    >
      <View style={styles.overlay}>
        <View style={styles.sheetContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.headerBadge}>BENGAL BUSINESS COUNCIL</Text>
              <Text style={styles.headerTitle}>Pass Council Business Referral</Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={closeGiveReferral}>
              <X color={colors.textPrimary} size={20} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.body}>
            {/* Member Selection */}
            <Text style={styles.inputLabel}>SELECT RECIPIENT MEMBER</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.memberScroll}>
              {otherUsers.map(member => {
                const isSelected = member.id === selectedUserId;
                return (
                  <TouchableOpacity
                    key={member.id}
                    style={[styles.memberCard, isSelected && styles.memberCardSelected]}
                    onPress={() => setSelectedUserId(member.id)}
                  >
                    <Image source={{ uri: member.avatar }} style={styles.memberAvatar} />
                    {isSelected && (
                      <View style={styles.checkedIcon}>
                        <Check color={colors.white} size={10} strokeWidth={3} />
                      </View>
                    )}
                    <Text style={[styles.memberName, isSelected && styles.textCrimson]} numberOfLines={1}>
                      {member.name.split(' ')[0]}
                    </Text>
                    <Text style={styles.memberCompany} numberOfLines={1}>
                      {member.companyName}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Selected Member Alert */}
            {selectedMember && (
              <View style={styles.selectedSummaryBox}>
                <Text style={styles.summaryLabel}>Giving Referral To:</Text>
                <Text style={styles.summaryName}>{selectedMember.name}</Text>
                <Text style={styles.summaryDetails}>
                  {selectedMember.designation} • {selectedMember.companyName}
                </Text>
              </View>
            )}

            {/* Prospect Name */}
            <View style={styles.fieldGroup}>
              <View style={styles.fieldLabelRow}>
                <UserCheck color={colors.crimson} size={14} />
                <Text style={styles.inputLabel}>PROSPECT / CLIENT NAME & TITLE</Text>
              </View>
              <TextInput
                style={styles.textInput}
                value={clientName}
                onChangeText={setClientName}
                placeholder="e.g. Debrup Sen (VP Procurement)"
                placeholderTextColor={colors.textMuted}
              />
            </View>

            {/* Service Needed */}
            <View style={styles.fieldGroup}>
              <View style={styles.fieldLabelRow}>
                <FileText color={colors.crimson} size={14} />
                <Text style={styles.inputLabel}>REQUIREMENT / SERVICE NEEDED</Text>
              </View>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={serviceNeeded}
                onChangeText={setServiceNeeded}
                placeholder="Describe what the prospect needs..."
                placeholderTextColor={colors.textMuted}
                multiline
                numberOfLines={2}
              />
            </View>

            {/* Estimated Value */}
            <View style={styles.fieldGroup}>
              <View style={styles.fieldLabelRow}>
                <DollarSign color={colors.crimson} size={14} />
                <Text style={styles.inputLabel}>ESTIMATED DEAL VALUE</Text>
              </View>
              <TextInput
                style={styles.textInput}
                value={estimatedValue}
                onChangeText={setEstimatedValue}
                placeholder="e.g. ₹ 35 Lakhs"
                placeholderTextColor={colors.textMuted}
              />
            </View>

            {/* Urgency Selector */}
            <View style={styles.fieldGroup}>
              <View style={styles.fieldLabelRow}>
                <Clock color={colors.crimson} size={14} />
                <Text style={styles.inputLabel}>LEAD URGENCY</Text>
              </View>
              <View style={styles.urgencyRow}>
                {(['Immediate', 'Within 30 Days', 'Exploring'] as Referral['urgency'][]).map(level => {
                  const isSelected = urgency === level;
                  return (
                    <TouchableOpacity
                      key={level}
                      style={[styles.urgencyBtn, isSelected && styles.urgencyBtnActive]}
                      onPress={() => setUrgency(level)}
                    >
                      <Text style={[styles.urgencyText, isSelected && styles.urgencyTextActive]}>
                        {level}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Submit Button */}
            <TouchableOpacity style={styles.submitBtn} onPress={handleSave} activeOpacity={0.8}>
              <Text style={styles.submitBtnText}>Pass Referral to Member</Text>
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
    marginBottom: 6,
  },
  memberScroll: {
    marginBottom: 12,
  },
  memberCard: {
    width: 90,
    alignItems: 'center',
    backgroundColor: colors.cardBgElevated,
    borderRadius: 12,
    padding: 8,
    marginRight: 10,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    position: 'relative',
  },
  memberCardSelected: {
    borderColor: colors.crimson,
    backgroundColor: '#FFF8F8',
  },
  memberAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginBottom: 6,
  },
  checkedIcon: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.crimson,
    alignItems: 'center',
    justifyContent: 'center',
  },
  memberName: {
    fontSize: 11.5,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  textCrimson: {
    color: colors.crimson,
  },
  memberCompany: {
    fontSize: 9,
    color: colors.textSecondary,
    marginTop: 1,
  },
  selectedSummaryBox: {
    backgroundColor: colors.cardBgElevated,
    borderRadius: 10,
    padding: 10,
    marginBottom: 14,
    borderLeftWidth: 3,
    borderLeftColor: colors.accentBlue,
  },
  summaryLabel: {
    fontSize: 9.5,
    color: colors.textMuted,
  },
  summaryName: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  summaryDetails: {
    fontSize: 11,
    color: colors.accentBlue,
    marginTop: 1,
  },
  fieldGroup: {
    marginBottom: 14,
  },
  fieldLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
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
    height: 60,
    textAlignVertical: 'top',
  },
  urgencyRow: {
    flexDirection: 'row',
    gap: 8,
  },
  urgencyBtn: {
    flex: 1,
    backgroundColor: colors.cardBgElevated,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  urgencyBtnActive: {
    backgroundColor: colors.crimsonLight,
    borderColor: colors.crimson,
  },
  urgencyText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  urgencyTextActive: {
    color: colors.crimson,
    fontWeight: '700',
  },
  submitBtn: {
    backgroundColor: colors.crimson,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  submitBtnText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});
