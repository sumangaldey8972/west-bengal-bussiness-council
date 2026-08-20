import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  ShieldCheck,
  Building2,
  Lock,
  Phone,
  ArrowRight,
  Sparkles,
  Users2,
  CheckCircle,
  KeyRound,
  RefreshCw,
  Info,
} from 'lucide-react-native';
import { colors } from '../theme/colors';
import { useApp } from '../context/AppContext';
import { User } from '../types';

interface LoginScreenProps {
  navigation: any;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const { login, users } = useApp();
  const [mobileOrEmail, setMobileOrEmail] = useState('+91 98301 23456');
  const [otpOrPassword, setOtpOrPassword] = useState('');
  const [isOtpMode, setIsOtpMode] = useState(true);
  const [otpSent, setOtpSent] = useState(false);
  const [demoOtp, setDemoOtp] = useState('123456');
  const [timer, setTimer] = useState(30);

  useEffect(() => {
    let interval: any;
    if (otpSent && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpSent, timer]);

  const handleSendOtp = () => {
    if (!mobileOrEmail.trim()) {
      Alert.alert('Credential Required', 'Please enter your mobile number or email.');
      return;
    }
    setOtpSent(true);
    setTimer(30);
    setDemoOtp('123456');
    setOtpOrPassword('123456'); // Auto-fill for convenience in POC testing
    Alert.alert(
      'Demo OTP Dispatched',
      'Secretariat SMS Simulation: Your 6-digit council access code is 123456 (auto-filled for quick testing).'
    );
  };

  const handleStandardLogin = () => {
    if (!mobileOrEmail.trim()) {
      Alert.alert('Credential Required', 'Please enter your registered mobile number or executive email.');
      return;
    }

    if (isOtpMode && !otpOrPassword.trim()) {
      Alert.alert('OTP Required', 'Please enter the 6-digit OTP (e.g. 123456).');
      return;
    }

    // Match entered email/phone with mock users or default to Rajiv Debnath
    const matchedUser = users.find(
      u =>
        u.contact.phone.includes(mobileOrEmail.trim()) ||
        u.contact.email.toLowerCase() === mobileOrEmail.toLowerCase().trim()
    ) || users[0];

    login(matchedUser);
  };

  const handleQuickDemoUserLogin = (user: User) => {
    login(user);
  };

  const handleQuickFill = (phoneOrEmail: string) => {
    setMobileOrEmail(phoneOrEmail);
    if (isOtpMode) {
      setOtpSent(true);
      setOtpOrPassword('123456');
    } else {
      setOtpOrPassword('secretariat@2026');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Header & Logo */}
          <View style={styles.headerSection}>
            <View style={styles.crestRow}>
              <View style={styles.crestBadge}>
                <Text style={styles.crestBadgeText}>BBC</Text>
              </View>
              <View>
                <Text style={styles.councilTitle}>BENGAL BUSINESS COUNCIL</Text>
                <Text style={styles.councilMotto}>Voice of Bengali Businesses Worldwide</Text>
              </View>
            </View>

            <View style={styles.badgePill}>
              <ShieldCheck color={colors.crimson} size={14} />
              <Text style={styles.badgePillText}>EXECUTIVE PORTAL • INVITE & MEMBERSHIP</Text>
            </View>

            <Text style={styles.welcomeHeading}>Sign In to Council Desk</Text>
            <Text style={styles.welcomeSubtitle}>
              Connect with fellow business owners, access verified tenders, log 1-to-1 meetings, and pass B2B referrals across West Bengal.
            </Text>
          </View>

          {/* Login Form Card */}
          <View style={styles.formCard}>
            {/* Input Method Toggle */}
            <View style={styles.toggleRow}>
              <TouchableOpacity
                style={[styles.toggleBtn, isOtpMode && styles.toggleBtnActive]}
                onPress={() => {
                  setIsOtpMode(true);
                  setOtpSent(false);
                }}
              >
                <Text style={[styles.toggleBtnText, isOtpMode && styles.toggleBtnTextActive]}>
                  Mobile & OTP
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.toggleBtn, !isOtpMode && styles.toggleBtnActive]}
                onPress={() => {
                  setIsOtpMode(false);
                  setOtpOrPassword('secretariat@2026');
                }}
              >
                <Text style={[styles.toggleBtnText, !isOtpMode && styles.toggleBtnTextActive]}>
                  Council ID / Password
                </Text>
              </TouchableOpacity>
            </View>

            {/* Quick Fill Preset Chips */}
            <View style={styles.presetsContainer}>
              <Text style={styles.presetsLabel}>QUICK FILL DEMO CREDENTIALS:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.presetsScroll}>
                <TouchableOpacity
                  style={styles.presetChip}
                  onPress={() => handleQuickFill('+91 98301 23456')}
                >
                  <Text style={styles.presetChipText}>Rajiv (+91 98301 23456)</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.presetChip}
                  onPress={() => handleQuickFill('priyanka@bengalsilks.com')}
                >
                  <Text style={styles.presetChipText}>Priyanka (CEO, Bengal Silks)</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.presetChip}
                  onPress={() => handleQuickFill('amitava@durgapuralloys.com')}
                >
                  <Text style={styles.presetChipText}>Amitava (Durgapur Alloys)</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>

            {/* Mobile / Email Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                {isOtpMode ? 'REGISTERED EXECUTIVE MOBILE' : 'COUNCIL EMAIL OR GST NUMBER'}
              </Text>
              <View style={styles.inputBox}>
                <Phone color={colors.textSecondary} size={18} />
                <TextInput
                  style={styles.input}
                  value={mobileOrEmail}
                  onChangeText={setMobileOrEmail}
                  placeholder={isOtpMode ? "+91 98300 00000" : "director@company.com"}
                  placeholderTextColor={colors.textMuted}
                  keyboardType={isOtpMode ? "phone-pad" : "email-address"}
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* OTP Mode Actions & Code Input */}
            {isOtpMode ? (
              <>
                {!otpSent ? (
                  <TouchableOpacity
                    style={styles.sendOtpBtn}
                    onPress={handleSendOtp}
                    activeOpacity={0.8}
                  >
                    <KeyRound color={colors.white} size={16} />
                    <Text style={styles.sendOtpBtnText}>Generate Demo OTP (SMS Simulation)</Text>
                  </TouchableOpacity>
                ) : (
                  <>
                    {/* Simulated OTP Alert Banner */}
                    <View style={styles.otpBanner}>
                      <Info color={colors.emerald} size={16} />
                      <View style={styles.otpBannerTextCol}>
                        <Text style={styles.otpBannerTitle}>Simulated SMS Received</Text>
                        <Text style={styles.otpBannerCode}>
                          Your Bengal Business Council OTP is <Text style={styles.boldText}>{demoOtp}</Text>
                        </Text>
                      </View>
                    </View>

                    <View style={styles.inputGroup}>
                      <View style={styles.labelRow}>
                        <Text style={styles.inputLabel}>ENTER 6-DIGIT OTP</Text>
                        <TouchableOpacity
                          onPress={handleSendOtp}
                          disabled={timer > 0}
                          style={styles.resendTouch}
                        >
                          <RefreshCw color={timer > 0 ? colors.textMuted : colors.crimson} size={12} />
                          <Text style={[styles.resendText, timer > 0 && styles.resendTextDisabled]}>
                            {timer > 0 ? `Resend in ${timer}s` : 'Resend OTP'}
                          </Text>
                        </TouchableOpacity>
                      </View>

                      <View style={styles.inputBox}>
                        <Lock color={colors.textSecondary} size={18} />
                        <TextInput
                          style={[styles.input, styles.otpInputText]}
                          value={otpOrPassword}
                          onChangeText={setOtpOrPassword}
                          placeholder="123456"
                          placeholderTextColor={colors.textMuted}
                          keyboardType="numeric"
                          maxLength={6}
                        />
                      </View>
                    </View>

                    {/* Sign In Button */}
                    <TouchableOpacity
                      style={styles.primaryLoginBtn}
                      onPress={handleStandardLogin}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.primaryBtnText}>Verify OTP & Enter Council Desk</Text>
                      <ArrowRight color={colors.white} size={18} />
                    </TouchableOpacity>
                  </>
                )}
              </>
            ) : (
              /* Password Mode */
              <>
                <View style={styles.inputGroup}>
                  <View style={styles.labelRow}>
                    <Text style={styles.inputLabel}>EXECUTIVE PASSWORD</Text>
                    <TouchableOpacity
                      onPress={() => Alert.alert('Secretariat Reset', 'A password reset link has been dispatched to your corporate email.')}
                    >
                      <Text style={styles.forgotText}>Forgot Password?</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.inputBox}>
                    <Lock color={colors.textSecondary} size={18} />
                    <TextInput
                      style={styles.input}
                      value={otpOrPassword}
                      onChangeText={setOtpOrPassword}
                      placeholder="Enter Password"
                      placeholderTextColor={colors.textMuted}
                      secureTextEntry
                    />
                  </View>
                </View>

                {/* Sign In Button */}
                <TouchableOpacity
                  style={styles.primaryLoginBtn}
                  onPress={handleStandardLogin}
                  activeOpacity={0.8}
                >
                  <Text style={styles.primaryBtnText}>Sign In to Executive Desk</Text>
                  <ArrowRight color={colors.white} size={18} />
                </TouchableOpacity>
              </>
            )}
          </View>

          {/* Quick Demo Personas Switcher */}
          <View style={styles.demoSection}>
            <View style={styles.demoHeaderRow}>
              <Sparkles color={colors.crimson} size={16} />
              <Text style={styles.demoSectionTitle}>1-CLICK POC EXECUTIVE PERSONA SIGN-IN</Text>
            </View>
            <Text style={styles.demoSectionSub}>
              Tap any business leader below to instantly enter the app with their verified council profile, ₹ deals, and meetings:
            </Text>

            <View style={styles.demoUsersList}>
              {users.map(user => (
                <TouchableOpacity
                  key={user.id}
                  style={styles.demoUserCard}
                  onPress={() => handleQuickDemoUserLogin(user)}
                  activeOpacity={0.7}
                >
                  <Image source={{ uri: user.avatar }} style={styles.demoAvatar} />
                  <View style={styles.demoUserInfo}>
                    <View style={styles.demoNameRow}>
                      <Text style={styles.demoUserName}>{user.name}</Text>
                      <CheckCircle color={colors.emerald} size={13} />
                    </View>
                    <Text style={styles.demoDesignation}>{user.designation}</Text>
                    <View style={styles.demoCompanyRow}>
                      <Building2 color={colors.primary} size={11} />
                      <Text style={styles.demoCompany} numberOfLines={1}>{user.companyName}</Text>
                    </View>
                    <Text style={styles.chapterBadgeSmall}>{user.chapter}</Text>
                  </View>
                  <View style={styles.loginPill}>
                    <Text style={styles.loginPillText}>Sign In ➔</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Apply for Council Membership CTA */}
          <View style={styles.signupBox}>
            <View style={styles.signupTextCol}>
              <Users2 color={colors.crimson} size={20} />
              <View style={styles.signupDetails}>
                <Text style={styles.signupTitle}>New Business Owner in West Bengal?</Text>
                <Text style={styles.signupSubtitle}>
                  Apply for verified council membership, digital visiting card, and chapter access.
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.signUpBtn}
              onPress={() => navigation.navigate('SignUp')}
              activeOpacity={0.8}
            >
              <Text style={styles.signUpBtnText}>Apply for Membership / Register</Text>
            </TouchableOpacity>
          </View>

          {/* Footer Assistance */}
          <View style={styles.footerHelp}>
            <Text style={styles.helpText}>
              Need Secretariat assistance? Call <Text style={styles.helpHighlight}>+91 (033) 4000-8800</Text> or email <Text style={styles.helpHighlight}>secretariat@bengalbusinesscouncil.com</Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 18,
    marginTop: 10,
  },
  crestRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  crestBadge: {
    backgroundColor: colors.crimson,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 10,
  },
  crestBadgeText: {
    color: colors.white,
    fontWeight: '900',
    fontSize: 13,
  },
  councilTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.primary,
    letterSpacing: 0.8,
  },
  councilMotto: {
    fontSize: 10,
    color: colors.crimson,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.crimsonLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.crimsonBorder,
    gap: 6,
    marginBottom: 10,
  },
  badgePillText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: colors.crimson,
    letterSpacing: 0.5,
  },
  welcomeHeading: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 10,
  },
  formCard: {
    backgroundColor: colors.cardBg,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    marginBottom: 16,
  },
  toggleRow: {
    flexDirection: 'row',
    backgroundColor: colors.cardBgElevated,
    borderRadius: 10,
    padding: 3,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  toggleBtnActive: {
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.crimsonBorder,
  },
  toggleBtnText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: colors.textMuted,
  },
  toggleBtnTextActive: {
    color: colors.crimson,
    fontWeight: '700',
  },
  presetsContainer: {
    marginBottom: 12,
  },
  presetsLabel: {
    fontSize: 8.5,
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  presetsScroll: {
    gap: 6,
  },
  presetChip: {
    backgroundColor: colors.cardBgElevated,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  presetChipText: {
    fontSize: 10.5,
    color: colors.primary,
    fontWeight: '600',
  },
  inputGroup: {
    marginBottom: 12,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  inputLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  resendTouch: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  resendText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: colors.crimson,
  },
  resendTextDisabled: {
    color: colors.textMuted,
  },
  forgotText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: colors.accentBlue,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBgElevated,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    paddingHorizontal: 12,
    height: 44,
    gap: 10,
  },
  input: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 13.5,
  },
  otpInputText: {
    letterSpacing: 4,
    fontWeight: '800',
    color: colors.crimson,
  },
  sendOtpBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accentBlue,
    borderRadius: 10,
    paddingVertical: 12,
    marginTop: 4,
    gap: 8,
  },
  sendOtpBtnText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '700',
  },
  otpBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.emeraldLight,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.emeraldBorder,
    marginBottom: 12,
    gap: 8,
  },
  otpBannerTextCol: {
    flex: 1,
  },
  otpBannerTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.emerald,
    letterSpacing: 0.5,
  },
  otpBannerCode: {
    fontSize: 12,
    color: colors.textPrimary,
    marginTop: 1,
  },
  boldText: {
    fontWeight: '800',
    color: colors.emerald,
  },
  primaryLoginBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.crimson,
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 6,
    gap: 8,
  },
  primaryBtnText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  demoSection: {
    backgroundColor: colors.cardBg,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginBottom: 16,
  },
  demoHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  demoSectionTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.crimson,
    letterSpacing: 0.8,
  },
  demoSectionSub: {
    fontSize: 11.5,
    color: colors.textSecondary,
    marginBottom: 12,
    lineHeight: 16,
  },
  demoUsersList: {
    gap: 8,
  },
  demoUserCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBgElevated,
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  demoAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: colors.crimson,
    marginRight: 10,
  },
  demoUserInfo: {
    flex: 1,
  },
  demoNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  demoUserName: {
    fontSize: 13.5,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  demoDesignation: {
    fontSize: 10.5,
    color: colors.textSecondary,
    marginTop: 1,
  },
  demoCompanyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 1,
  },
  demoCompany: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.primary,
  },
  chapterBadgeSmall: {
    fontSize: 9.5,
    color: colors.textMuted,
    marginTop: 1,
  },
  loginPill: {
    backgroundColor: colors.crimsonLight,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.crimsonBorder,
  },
  loginPillText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.crimson,
  },
  signupBox: {
    backgroundColor: colors.cardBgElevated,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginBottom: 16,
    gap: 12,
  },
  signupTextCol: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  signupDetails: {
    flex: 1,
  },
  signupTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  signupSubtitle: {
    fontSize: 11.5,
    color: colors.textSecondary,
    lineHeight: 16,
    marginTop: 2,
  },
  signUpBtn: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  signUpBtnText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '700',
  },
  footerHelp: {
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  helpText: {
    fontSize: 11,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 16,
  },
  helpHighlight: {
    color: colors.primary,
    fontWeight: '700',
  },
});
