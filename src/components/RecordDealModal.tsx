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
  ActivityIndicator,
} from 'react-native';
import { X, TrendingUp, DollarSign, FileText, Sparkles, Check } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { BusinessDeal } from '../types';
import { useApp } from '../context/AppContext';

export const RecordDealModal: React.FC = () => {
  const { showRecordDealModal, closeRecordDeal, users, currentUser, recordBusinessDeal } = useApp();

  const otherUsers = users.filter(u => u.id !== currentUser.id);

  const [selectedUserId, setSelectedUserId] = useState<string>(otherUsers[0]?.id || '');
  const [dealAmountText, setDealAmountText] = useState('2500000'); // 25 Lakhs
  const [dealDescription, setDealDescription] = useState('Order for precision parts and fabrication testing');
  const [referralType, setReferralType] = useState<BusinessDeal['referralType']>('Inside Council');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!showRecordDealModal) return null;

  const rawAmount = parseInt(dealAmountText.replace(/[^0-9]/g, ''), 10) || 1000000;
  const formattedInLakhs = rawAmount >= 10000000 
    ? `₹ ${(rawAmount / 10000000).toFixed(2)} Crores` 
    : `₹ ${(rawAmount / 100000).toFixed(1)} Lakhs`;

  const handleSave = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      recordBusinessDeal(selectedUserId, formattedInLakhs, rawAmount, dealDescription, referralType);
      setIsSubmitting(false);
      closeRecordDeal();
      Alert.alert(
        'Business Deal Recorded! 🏆',
        `Great news! ${formattedInLakhs} in business has been added to your profile records.`
      );
    }, 900);
  };

  const selectedMember = users.find(u => u.id === selectedUserId) || otherUsers[0];

  return (
    <Modal
      visible={showRecordDealModal}
      transparent
      animationType="slide"
      onRequestClose={closeRecordDeal}
    >
      <View style={styles.overlay}>
        <View style={styles.sheetContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.headerBadge}>BENGAL BUSINESS COUNCIL</Text>
              <Text style={styles.headerTitle}>Record a Closed Business Deal</Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={closeRecordDeal}>
              <X color={colors.textPrimary} size={20} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.body}>
            {/* Value Preview Banner */}
            <View style={styles.dealHighlightBox}>
              <View style={styles.sparkleRow}>
                <Sparkles color={colors.emerald} size={16} />
                <Text style={styles.dealHighlightLabel}>BUSINESS DEAL VALUE</Text>
              </View>
              <Text style={styles.dealHighlightValue}>{formattedInLakhs}</Text>
              <Text style={styles.dealHighlightSub}>
                Thank You For Business between Council Members
              </Text>
            </View>

            {/* Member Selection */}
            <Text style={styles.inputLabel}>SELECT MEMBER YOU DID BUSINESS WITH</Text>
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

            {selectedMember && (
              <View style={styles.selectedSummaryBox}>
                <Text style={styles.summaryLabel}>Deal with Member:</Text>
                <Text style={styles.summaryName}>{selectedMember.name}</Text>
                <Text style={styles.summaryDetails}>
                  {selectedMember.designation} • {selectedMember.companyName}
                </Text>
              </View>
            )}

            {/* Deal Amount Input */}
            <View style={styles.fieldGroup}>
              <View style={styles.fieldLabelRow}>
                <DollarSign color={colors.crimson} size={14} />
                <Text style={styles.inputLabel}>DEAL AMOUNT (IN RUPEES ₹)</Text>
              </View>
              <TextInput
                style={styles.textInput}
                value={dealAmountText}
                onChangeText={setDealAmountText}
                keyboardType="numeric"
                placeholder="e.g. 2500000"
                placeholderTextColor={colors.textMuted}
              />
              <Text style={styles.helperText}>Enter amount in Rupees (e.g. 5000000 for 50 Lakhs, 10000000 for 1 Crore)</Text>
            </View>

            {/* Deal Description */}
            <View style={styles.fieldGroup}>
              <View style={styles.fieldLabelRow}>
                <FileText color={colors.crimson} size={14} />
                <Text style={styles.inputLabel}>WHAT WAS THE DEAL ABOUT?</Text>
              </View>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={dealDescription}
                onChangeText={setDealDescription}
                placeholder="Briefly describe what was bought or sold..."
                placeholderTextColor={colors.textMuted}
                multiline
                numberOfLines={2}
              />
            </View>

            {/* Referral Source Type */}
            <View style={styles.fieldGroup}>
              <Text style={styles.inputLabel}>TYPE OF DEAL</Text>
              <View style={styles.refTypeRow}>
                {(['Inside Council', 'Cross-Chapter Referral', 'Tier-3 Referral'] as BusinessDeal['referralType'][]).map(type => {
                  const isSelected = referralType === type;
                  return (
                    <TouchableOpacity
                      key={type}
                      style={[styles.refTypeBtn, isSelected && styles.refTypeBtnActive]}
                      onPress={() => setReferralType(type)}
                    >
                      <Text style={[styles.refTypeText, isSelected && styles.refTypeTextActive]}>
                        {type}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[styles.submitBtn, isSubmitting && { opacity: 0.75 }]}
              onPress={handleSave}
              disabled={isSubmitting}
              activeOpacity={0.8}
            >
              {isSubmitting ? (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <ActivityIndicator size="small" color={colors.white} />
                  <Text style={styles.submitBtnText}>Saving Business Deal...</Text>
                </View>
              ) : (
                <>
                  <TrendingUp color={colors.white} size={18} />
                  <Text style={styles.submitBtnText}>Save Business Deal</Text>
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
  dealHighlightBox: {
    backgroundColor: colors.emeraldLight,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.emeraldBorder,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  sparkleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  dealHighlightLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.emerald,
    letterSpacing: 1,
  },
  dealHighlightValue: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.emerald,
    letterSpacing: 0.5,
    marginVertical: 4,
  },
  dealHighlightSub: {
    fontSize: 11,
    color: colors.textSecondary,
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
    borderLeftColor: colors.emerald,
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
    fontSize: 14,
    fontWeight: '600',
  },
  helperText: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 4,
  },
  textArea: {
    height: 60,
    textAlignVertical: 'top',
    fontSize: 13,
    fontWeight: '400',
  },
  refTypeRow: {
    flexDirection: 'row',
    gap: 6,
  },
  refTypeBtn: {
    flex: 1,
    backgroundColor: colors.cardBgElevated,
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  refTypeBtnActive: {
    backgroundColor: colors.emeraldLight,
    borderColor: colors.emerald,
  },
  refTypeText: {
    fontSize: 10,
    color: colors.textSecondary,
    fontWeight: '600',
    textAlign: 'center',
  },
  refTypeTextActive: {
    color: colors.emerald,
    fontWeight: '700',
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.emerald,
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 8,
    gap: 8,
  },
  submitBtnText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
