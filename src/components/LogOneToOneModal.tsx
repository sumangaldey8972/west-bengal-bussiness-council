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
import { X, Calendar, Clock, MapPin, AlignLeft, Check } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { useApp } from '../context/AppContext';

export const LogOneToOneModal: React.FC = () => {
  const {
    showLogOneToOneModal,
    targetOneToOneUser,
    closeLogOneToOne,
    users,
    currentUser,
    logOneToOne,
  } = useApp();

  const otherUsers = users.filter(u => u.id !== currentUser.id);

  const [selectedUserId, setSelectedUserId] = useState<string>(
    targetOneToOneUser?.id || otherUsers[0]?.id || ''
  );
  const [date, setDate] = useState('Thursday, Aug 27, 2026');
  const [time, setTime] = useState('11:00 AM - 11:45 AM');
  const [location, setLocation] = useState('BBC Secretariat Boardroom, Salt Lake');
  const [agenda, setAgenda] = useState('Cross-industry collaboration & B2B capabilities briefing');

  if (!showLogOneToOneModal) return null;

  const handleSave = () => {
    logOneToOne(selectedUserId, date, time, location, agenda);
    Alert.alert(
      '1-to-1 Meeting Scheduled!',
      'Calendar invite and notification sent to the member. Logged in your council performance dashboard.'
    );
    closeLogOneToOne();
  };

  const selectedMember = users.find(u => u.id === selectedUserId) || otherUsers[0];

  return (
    <Modal
      visible={showLogOneToOneModal}
      transparent
      animationType="slide"
      onRequestClose={closeLogOneToOne}
    >
      <View style={styles.overlay}>
        <View style={styles.sheetContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.headerBadge}>BENGAL BUSINESS COUNCIL</Text>
              <Text style={styles.headerTitle}>Schedule / Log 1-to-1 Meeting</Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={closeLogOneToOne}>
              <X color={colors.textPrimary} size={20} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.body}>
            {/* Member Selection */}
            <Text style={styles.inputLabel}>SELECT COUNCIL MEMBER</Text>
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

            {/* Selected Member Summary Card */}
            {selectedMember && (
              <View style={styles.selectedSummaryBox}>
                <Text style={styles.summaryLabel}>Meeting with:</Text>
                <Text style={styles.summaryName}>{selectedMember.name}</Text>
                <Text style={styles.summaryDetails}>
                  {selectedMember.designation} • {selectedMember.companyName}
                </Text>
              </View>
            )}

            {/* Date Input */}
            <View style={styles.fieldGroup}>
              <View style={styles.fieldLabelRow}>
                <Calendar color={colors.crimson} size={14} />
                <Text style={styles.inputLabel}>MEETING DATE</Text>
              </View>
              <TextInput
                style={styles.textInput}
                value={date}
                onChangeText={setDate}
                placeholder="e.g. Thursday, Aug 27, 2026"
                placeholderTextColor={colors.textMuted}
              />
            </View>

            {/* Time Input */}
            <View style={styles.fieldGroup}>
              <View style={styles.fieldLabelRow}>
                <Clock color={colors.crimson} size={14} />
                <Text style={styles.inputLabel}>TIME & DURATION</Text>
              </View>
              <TextInput
                style={styles.textInput}
                value={time}
                onChangeText={setTime}
                placeholder="e.g. 11:00 AM - 11:45 AM"
                placeholderTextColor={colors.textMuted}
              />
            </View>

            {/* Location Input */}
            <View style={styles.fieldGroup}>
              <View style={styles.fieldLabelRow}>
                <MapPin color={colors.crimson} size={14} />
                <Text style={styles.inputLabel}>LOCATION / PLATFORM</Text>
              </View>
              <TextInput
                style={styles.textInput}
                value={location}
                onChangeText={setLocation}
                placeholder="e.g. BBC Secretariat Boardroom / Zoom"
                placeholderTextColor={colors.textMuted}
              />
            </View>

            {/* Agenda */}
            <View style={styles.fieldGroup}>
              <View style={styles.fieldLabelRow}>
                <AlignLeft color={colors.crimson} size={14} />
                <Text style={styles.inputLabel}>MEETING AGENDA & GOALS</Text>
              </View>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={agenda}
                onChangeText={setAgenda}
                placeholder="Describe key topics and potential synergies..."
                placeholderTextColor={colors.textMuted}
                multiline
                numberOfLines={3}
              />
            </View>

            {/* Submit Button */}
            <TouchableOpacity style={styles.submitBtn} onPress={handleSave} activeOpacity={0.8}>
              <Text style={styles.submitBtnText}>Confirm 1-to-1 Meeting</Text>
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
    borderLeftColor: colors.crimson,
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
    height: 70,
    textAlignVertical: 'top',
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
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
