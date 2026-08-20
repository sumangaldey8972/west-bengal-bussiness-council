import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  Dimensions,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import {
  X,
  Share2,
  Copy,
  ShieldCheck,
  Building2,
  Mail,
  Phone,
  Globe,
  MapPin,
  FileText,
  CreditCard,
  CheckCircle2,
} from 'lucide-react-native';
import { colors } from '../theme/colors';
import { useApp } from '../context/AppContext';

const { width } = Dimensions.get('window');

export const DigitalBusinessCardModal: React.FC = () => {
  const {
    showBusinessCardModal,
    selectedBusinessCardUser,
    closeDigitalBusinessCard,
    currentUser,
    openLogOneToOne,
    openGiveReferral,
  } = useApp();

  const [cardSide, setCardSide] = useState<'front' | 'qr'>('front');
  const [requestedPhysicalCard, setRequestedPhysicalCard] = useState(false);

  const user = selectedBusinessCardUser || currentUser;
  const isMe = user.id === currentUser.id;

  if (!showBusinessCardModal) return null;

  // vCard text payload for QR Code
  const vCardPayload = `BEGIN:VCARD\nVERSION:3.0\nN:${user.name}\nFN:${user.name}\nORG:${user.companyName}\nTITLE:${user.designation}\nTEL:${user.contact.phone}\nEMAIL:${user.contact.email}\nURL:${user.contact.website}\nADR:;;${user.contact.officeAddress}\nNOTE:Bengal Business Council Member (${user.membershipTier})\nEND:VCARD`;

  const handleCopyVCard = () => {
    Alert.alert(
      'Contact Copied',
      `${user.name}'s business card details have been copied to your clipboard.`
    );
  };

  const handleShareCard = () => {
    Alert.alert(
      'Share Digital Card',
      `Shared link to ${user.name}'s profile: https://bengalbusinesscouncil.com/members/${user.id}`
    );
  };

  const handleRequestPhysicalCard = () => {
    setRequestedPhysicalCard(true);
    Alert.alert(
      'Printed Card Order Placed',
      'Your request for 100 printed visiting cards has been received. Your cards will be delivered to your office within 5 working days.'
    );
  };

  return (
    <Modal
      visible={showBusinessCardModal}
      transparent
      animationType="slide"
      onRequestClose={closeDigitalBusinessCard}
    >
      <View style={styles.overlay}>
        <View style={styles.modalSheet}>
          {/* Header */}
          <View style={styles.sheetHeader}>
            <View>
              <Text style={styles.sheetBadge}>OFFICIAL DIGITAL VISITING CARD</Text>
              <Text style={styles.sheetTitle}>{isMe ? 'My Business Card' : `${user.name.split(' ')[0]}'s Profile`}</Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={closeDigitalBusinessCard}>
              <X color={colors.textPrimary} size={20} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollBody}>
            {/* Card Flip Selector Tab */}
            <View style={styles.flipTabRow}>
              <TouchableOpacity
                style={[styles.flipTab, cardSide === 'front' && styles.flipTabActive]}
                onPress={() => setCardSide('front')}
              >
                <CreditCard color={cardSide === 'front' ? colors.crimson : colors.textMuted} size={16} />
                <Text style={[styles.flipTabText, cardSide === 'front' && styles.flipTabTextActive]}>
                  Visiting Card
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.flipTab, cardSide === 'qr' && styles.flipTabActive]}
                onPress={() => setCardSide('qr')}
              >
                <Text style={[styles.flipTabText, cardSide === 'qr' && styles.flipTabTextActive]}>
                  Scan QR (vCard)
                </Text>
              </TouchableOpacity>
            </View>

            {/* Visiting Card View */}
            {cardSide === 'front' ? (
              <View style={styles.visitingCardContainer}>
                {/* Crest Top Banner */}
                <View style={styles.cardTopBanner}>
                  <View style={styles.crestRow}>
                    <View style={styles.crestBadge}>
                      <Text style={styles.crestBadgeText}>BBC</Text>
                    </View>
                    <View>
                      <Text style={styles.councilName}>BENGAL BUSINESS COUNCIL</Text>
                      <Text style={styles.councilMotto}>Voice of Bengali Businesses Worldwide</Text>
                    </View>
                  </View>
                  <View style={styles.tierPill}>
                    <Text style={styles.tierPillText}>{user.membershipTier}</Text>
                  </View>
                </View>

                {/* Member Details */}
                <View style={styles.cardMainContent}>
                  <View style={styles.memberPhotoRow}>
                    <Image source={{ uri: user.avatar }} style={styles.cardAvatar} />
                    <View style={styles.memberInfoCol}>
                      <View style={styles.verifiedRow}>
                        <Text style={styles.cardMemberName}>{user.name}</Text>
                        <ShieldCheck color={colors.emerald} size={16} />
                      </View>
                      <Text style={styles.cardDesignation}>{user.designation}</Text>
                      <Text style={styles.cardCompany}>{user.companyName}</Text>
                    </View>
                  </View>

                  <View style={styles.divider} />

                  {/* Business Specifications */}
                  <View style={styles.cardMetaGrid}>
                    <View style={styles.metaItem}>
                      <Text style={styles.metaLabel}>INDUSTRY</Text>
                      <Text style={styles.metaValue} numberOfLines={1}>{user.industry}</Text>
                    </View>

                    <View style={styles.metaItem}>
                      <Text style={styles.metaLabel}>GSTIN (VERIFIED)</Text>
                      <Text style={styles.metaValueGst}>{user.gstNumber}</Text>
                    </View>

                    <View style={styles.metaItem}>
                      <Text style={styles.metaLabel}>ANNUAL TURNOVER</Text>
                      <Text style={styles.metaValue}>{user.turnover}</Text>
                    </View>

                    <View style={styles.metaItem}>
                      <Text style={styles.metaLabel}>CHAPTER</Text>
                      <Text style={styles.metaValue}>{user.chapter}</Text>
                    </View>
                  </View>
                </View>

                {/* Card Footer */}
                <View style={styles.cardFooter}>
                  <Text style={styles.cardFooterContact}>{user.contact.email} • {user.contact.phone}</Text>
                  <Text style={styles.cardFooterSub}>Member Since {user.yearJoined}</Text>
                </View>
              </View>
            ) : (
              /* QR Code Side */
              <View style={styles.qrContainer}>
                <View style={styles.qrWhiteBox}>
                  <QRCode
                    value={vCardPayload}
                    size={width * 0.45}
                    color="#0B192C"
                    backgroundColor="#FFFFFF"
                  />
                </View>
                <Text style={styles.qrHelpText}>
                  Point your phone camera to scan and save {user.name}'s contact details.
                </Text>
              </View>
            )}

            {/* Business Contact Details Card */}
            <View style={styles.detailsCard}>
              <Text style={styles.detailsCardHeader}>BUSINESS CONTACT DETAILS</Text>

              <View style={styles.contactRow}>
                <Building2 color={colors.primary} size={16} />
                <Text style={styles.contactText}>{user.companyName}</Text>
              </View>

              <View style={styles.contactRow}>
                <Mail color={colors.textSecondary} size={16} />
                <Text style={styles.contactText}>{user.contact.email}</Text>
              </View>

              <View style={styles.contactRow}>
                <Phone color={colors.textSecondary} size={16} />
                <Text style={styles.contactText}>{user.contact.phone}</Text>
              </View>

              <View style={styles.contactRow}>
                <Globe color={colors.textSecondary} size={16} />
                <Text style={styles.contactText}>{user.contact.website}</Text>
              </View>

              <View style={styles.contactRow}>
                <MapPin color={colors.textSecondary} size={16} />
                <Text style={styles.contactText}>{user.contact.officeAddress}</Text>
              </View>
            </View>

            {/* Requirement Documents / Brochures */}
            {user.requirementDocs && user.requirementDocs.length > 0 && (
              <View style={styles.detailsCard}>
                <Text style={styles.detailsCardHeader}>COMPANY BROCHURES & DOCUMENTS</Text>
                {user.requirementDocs.map((doc, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={styles.docItemRow}
                    onPress={() => Alert.alert('Download Document', `Downloading ${doc.title}`)}
                  >
                    <FileText color={colors.crimson} size={18} />
                    <View style={styles.docItemInfo}>
                      <Text style={styles.docItemTitle} numberOfLines={1}>{doc.title}</Text>
                      <Text style={styles.docItemMeta}>{doc.type} • {doc.size}</Text>
                    </View>
                    <Text style={styles.docItemAction}>Download</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Action Buttons */}
            <View style={styles.actionsContainer}>
              <View style={styles.twoBtnRow}>
                <TouchableOpacity style={styles.secondaryActionBtn} onPress={handleCopyVCard}>
                  <Copy color={colors.primary} size={16} />
                  <Text style={styles.secondaryBtnText}>Copy Contact</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.secondaryActionBtn} onPress={handleShareCard}>
                  <Share2 color={colors.primary} size={16} />
                  <Text style={styles.secondaryBtnText}>Share Card</Text>
                </TouchableOpacity>
              </View>

              {/* Request Physical Card if Me */}
              {isMe ? (
                <TouchableOpacity
                  style={[styles.primaryActionBtn, requestedPhysicalCard && styles.btnSuccess]}
                  onPress={handleRequestPhysicalCard}
                  disabled={requestedPhysicalCard}
                >
                  {requestedPhysicalCard ? (
                    <>
                      <CheckCircle2 color={colors.white} size={18} />
                      <Text style={styles.primaryBtnText}>Visiting Card Order Placed</Text>
                    </>
                  ) : (
                    <>
                      <CreditCard color={colors.white} size={18} />
                      <Text style={styles.primaryBtnText}>Order Printed Physical Visiting Cards</Text>
                    </>
                  )}
                </TouchableOpacity>
              ) : (
                <View style={styles.twoBtnRow}>
                  <TouchableOpacity
                    style={styles.primaryActionBtnHalf}
                    onPress={() => {
                      closeDigitalBusinessCard();
                      openLogOneToOne(user);
                    }}
                  >
                    <Text style={styles.primaryBtnText}>Schedule 1-to-1</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.blueActionBtnHalf}
                    onPress={() => {
                      closeDigitalBusinessCard();
                      openGiveReferral(user);
                    }}
                  >
                    <Text style={styles.blueBtnText}>Give Referral</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
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
  modalSheet: {
    backgroundColor: colors.cardBg,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    maxHeight: '92%',
    paddingBottom: 24,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  sheetBadge: {
    fontSize: 9.5,
    fontWeight: '800',
    color: colors.crimson,
    letterSpacing: 1,
  },
  sheetTitle: {
    fontSize: 18,
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
  scrollBody: {
    padding: 16,
  },
  flipTabRow: {
    flexDirection: 'row',
    backgroundColor: colors.cardBgElevated,
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  flipTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  flipTabActive: {
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.crimsonBorder,
  },
  flipTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
  },
  flipTabTextActive: {
    color: colors.crimson,
    fontWeight: '700',
  },
  visitingCardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: colors.crimson,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cardTopBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
    paddingBottom: 10,
    marginBottom: 12,
  },
  crestRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  crestBadge: {
    backgroundColor: colors.crimson,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginRight: 8,
  },
  crestBadgeText: {
    color: colors.white,
    fontWeight: '900',
    fontSize: 10,
  },
  councilName: {
    fontSize: 11.5,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 0.5,
  },
  councilMotto: {
    fontSize: 8.5,
    color: colors.crimson,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  tierPill: {
    backgroundColor: colors.crimsonLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  tierPillText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: colors.crimson,
  },
  cardMainContent: {
    paddingVertical: 4,
  },
  memberPhotoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  cardAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: colors.crimson,
    backgroundColor: colors.cardBgElevated,
  },
  memberInfoCol: {
    flex: 1,
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  cardMemberName: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  cardDesignation: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 1,
  },
  cardCompany: {
    fontSize: 12.5,
    fontWeight: '700',
    color: colors.primary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.cardBorder,
    marginVertical: 10,
  },
  cardMetaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 10,
  },
  metaItem: {
    width: '50%',
  },
  metaLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 0.5,
  },
  metaValue: {
    fontSize: 11,
    color: colors.textPrimary,
    fontWeight: '600',
    marginTop: 1,
  },
  metaValueGst: {
    fontSize: 11,
    color: colors.emerald,
    fontWeight: '700',
    marginTop: 1,
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
    paddingTop: 8,
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardFooterContact: {
    fontSize: 9.5,
    color: colors.textSecondary,
  },
  cardFooterSub: {
    fontSize: 9.5,
    color: colors.crimson,
    fontWeight: '600',
  },
  qrContainer: {
    alignItems: 'center',
    backgroundColor: colors.cardBg,
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginBottom: 16,
  },
  qrWhiteBox: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  qrHelpText: {
    fontSize: 11.5,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 20,
  },
  detailsCard: {
    backgroundColor: colors.cardBgElevated,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginBottom: 14,
  },
  detailsCardHeader: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 5,
  },
  contactText: {
    fontSize: 12.5,
    color: colors.textPrimary,
    flex: 1,
  },
  docItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBg,
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
    gap: 10,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  docItemInfo: {
    flex: 1,
  },
  docItemTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  docItemMeta: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 2,
  },
  docItemAction: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.crimson,
  },
  actionsContainer: {
    gap: 10,
    marginTop: 6,
  },
  twoBtnRow: {
    flexDirection: 'row',
    gap: 10,
  },
  secondaryActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.cardBgElevated,
    borderRadius: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    gap: 8,
  },
  secondaryBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  primaryActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.crimson,
    borderRadius: 12,
    paddingVertical: 14,
    gap: 8,
  },
  btnSuccess: {
    backgroundColor: colors.emerald,
  },
  primaryBtnText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: colors.white,
  },
  primaryActionBtnHalf: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.crimson,
    borderRadius: 12,
    paddingVertical: 12,
  },
  blueActionBtnHalf: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accentBlue,
    borderRadius: 12,
    paddingVertical: 12,
  },
  blueBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.white,
  },
});
