import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
import { BrandLogo } from '../components/BrandLogo';
import { OtpAlertBanner } from '../components/OtpAlertBanner';
import { PremiumToast, ToastType } from '../components/PremiumToast';

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

  // Simulated API Loading States for Animations
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isResendingOtp, setIsResendingOtp] = useState(false);
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);

  // In-App Toast Notification State
  const [toastConfig, setToastConfig] = useState<{
    visible: boolean;
    type: ToastType;
    title: string;
    message: string;
  }>({
    visible: false,
    type: 'info',
    title: '',
    message: '',
  });

  const showToast = (type: ToastType, title: string, message: string) => {
    setToastConfig({
      visible: true,
      type,
      title,
      message,
    });
  };

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
      showToast('warning', 'Mobile or Email Required', 'Please enter your registered mobile number or email address.');
      return;
    }
    setIsSendingOtp(true);
    setTimeout(() => {
      setIsSendingOtp(false);
      setOtpSent(true);
      setTimer(30);
      setDemoOtp('123456');
      setOtpOrPassword('123456'); // Auto-fill for convenience in demo testing
      showToast(
        'success',
        'OTP Sent (Demo: 123456)',
        `A 6-digit OTP code was sent to ${mobileOrEmail.trim()} and filled below.`
      );
    }, 850);
  };

  const handleResendOtp = () => {
    if (timer > 0 || isResendingOtp) return;
    setIsResendingOtp(true);
    setTimeout(() => {
      setIsResendingOtp(false);
      setTimer(30);
      setDemoOtp('123456');
      setOtpOrPassword('123456');
      showToast(
        'success',
        'New OTP Sent',
        `A new 6-digit OTP code (123456) was sent to ${mobileOrEmail.trim()}.`
      );
    }, 750);
  };

  const handleStandardLogin = () => {
    if (!mobileOrEmail.trim()) {
      showToast('warning', 'Details Required', 'Please enter your mobile number or email address.');
      return;
    }

    if (isOtpMode && !otpOrPassword.trim()) {
      showToast('warning', 'OTP Required', 'Please enter the 6-digit OTP code (123456).');
      return;
    }

    setIsLoggingIn(true);
    setTimeout(() => {
      // Match entered email/phone with mock users or default to first user
      const matchedUser = users.find(
        u =>
          u.contact.phone.includes(mobileOrEmail.trim()) ||
          u.contact.email.toLowerCase() === mobileOrEmail.toLowerCase().trim()
      ) || users[0];

      setIsLoggingIn(false);
      login(matchedUser);
    }, 950);
  };

  const handleQuickDemoUserLogin = (user: User) => {
    setLoadingUserId(user.id);
    setTimeout(() => {
      setLoadingUserId(null);
      login(user);
    }, 750);
  };

  const handleQuickFill = (phoneOrEmail: string) => {
    setMobileOrEmail(phoneOrEmail);
    if (isOtpMode) {
      setOtpSent(true);
      setOtpOrPassword('123456');
      showToast('info', 'Demo Profile Selected', `Auto-filled details for ${phoneOrEmail}.`);
    } else {
      setOtpOrPassword('password123');
      showToast('info', 'Demo Profile Selected', `Auto-filled password.`);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Floating In-App Toast Notification */}
      <PremiumToast
        visible={toastConfig.visible}
        type={toastConfig.type}
        title={toastConfig.title}
        message={toastConfig.message}
        onDismiss={() => setToastConfig(prev => ({ ...prev, visible: false }))}
      />
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Header & Brand Logo */}
          <View style={styles.headerSection}>
            <View style={styles.loginEmblemWrapper}>
              <Image
                source={require('../../assets/splash-emblem.jpg')}
                style={styles.loginEmblemImage}
                resizeMode="cover"
              />
            </View>

            <BrandLogo size="large" centered={true} taglineText="by Bengal Business Council" style={styles.brandLogoBox} />

            <View style={styles.badgePill}>
              <ShieldCheck color={colors.crimson} size={13} />
              <Text style={styles.badgePillText}>BUSINESS OWNERS COMMUNITY</Text>
            </View>

            <Text style={styles.welcomeHeading}>Sign In to Your Account</Text>
            <Text style={styles.welcomeSubtitle}>
              Connect with verified business owners, discover new deals, attend meetings, and exchange trusted referrals across West Bengal.
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
                  setOtpOrPassword('password123');
                }}
              >
                <Text style={[styles.toggleBtnText, !isOtpMode && styles.toggleBtnTextActive]}>
                  Email & Password
                </Text>
              </TouchableOpacity>
            </View>

            {/* Mobile / Email Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                {isOtpMode ? 'MOBILE NUMBER' : 'EMAIL ADDRESS OR GST NUMBER'}
              </Text>
              <View style={styles.inputBox}>
                <Phone color={colors.textSecondary} size={18} />
                <TextInput
                  style={styles.input}
                  value={mobileOrEmail}
                  onChangeText={setMobileOrEmail}
                  placeholder={isOtpMode ? "+91 98300 00000" : "name@company.com"}
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
                    style={[styles.sendOtpBtn, isSendingOtp && styles.btnDisabled]}
                    onPress={handleSendOtp}
                    disabled={isSendingOtp}
                    activeOpacity={0.8}
                  >
                    {isSendingOtp ? (
                      <>
                        <ActivityIndicator size="small" color={colors.white} />
                        <Text style={styles.sendOtpBtnText}>Sending OTP...</Text>
                      </>
                    ) : (
                      <>
                        <KeyRound color={colors.white} size={16} />
                        <Text style={styles.sendOtpBtnText}>Send OTP</Text>
                      </>
                    )}
                  </TouchableOpacity>
                ) : (
                  <>
                    {/* Premium Simulated OTP Alert Banner */}
                    <OtpAlertBanner
                      otpCode={demoOtp}
                      recipient={mobileOrEmail}
                      timerSeconds={timer}
                      onCopy={() =>
                        showToast('success', 'OTP Copied', 'OTP 123456 has been copied.')
                      }
                    />

                    <View style={styles.inputGroup}>
                      <View style={styles.labelRow}>
                        <Text style={styles.inputLabel}>ENTER 6-DIGIT OTP</Text>
                        <TouchableOpacity
                          onPress={handleResendOtp}
                          disabled={timer > 0 || isResendingOtp}
                          style={styles.resendTouch}
                        >
                          {isResendingOtp ? (
                            <ActivityIndicator size="small" color={colors.crimson} style={{ transform: [{ scale: 0.75 }] }} />
                          ) : (
                            <RefreshCw color={timer > 0 ? colors.textMuted : colors.crimson} size={12} />
                          )}
                          <Text style={[styles.resendText, (timer > 0 || isResendingOtp) && styles.resendTextDisabled]}>
                            {isResendingOtp ? 'Sending...' : timer > 0 ? `Resend in ${timer}s` : 'Resend OTP'}
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
                          editable={!isLoggingIn}
                        />
                      </View>
                    </View>

                    {/* Sign In Button */}
                    <TouchableOpacity
                      style={[styles.primaryLoginBtn, isLoggingIn && styles.btnDisabled]}
                      onPress={handleStandardLogin}
                      disabled={isLoggingIn}
                      activeOpacity={0.8}
                    >
                      {isLoggingIn ? (
                        <>
                          <ActivityIndicator size="small" color={colors.white} />
                          <Text style={styles.primaryBtnText}>Checking OTP & Signing In...</Text>
                        </>
                      ) : (
                        <>
                          <Text style={styles.primaryBtnText}>Verify OTP & Sign In</Text>
                          <ArrowRight color={colors.white} size={18} />
                        </>
                      )}
                    </TouchableOpacity>
                  </>
                )}
              </>
            ) : (
              /* Password Mode */
              <>
                <View style={styles.inputGroup}>
                  <View style={styles.labelRow}>
                    <Text style={styles.inputLabel}>PASSWORD</Text>
                    <TouchableOpacity
                      onPress={() =>
                        showToast(
                          'info',
                          'Password Reset Sent',
                          'A password reset link was sent to your email.'
                        )
                      }
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
                      placeholder="Enter your password"
                      placeholderTextColor={colors.textMuted}
                      secureTextEntry
                      editable={!isLoggingIn}
                    />
                  </View>
                </View>

                {/* Sign In Button */}
                <TouchableOpacity
                  style={[styles.primaryLoginBtn, isLoggingIn && styles.btnDisabled]}
                  onPress={handleStandardLogin}
                  disabled={isLoggingIn}
                  activeOpacity={0.8}
                >
                  {isLoggingIn ? (
                    <>
                      <ActivityIndicator size="small" color={colors.white} />
                      <Text style={styles.primaryBtnText}>Signing In...</Text>
                    </>
                  ) : (
                    <>
                      <Text style={styles.primaryBtnText}>Sign In</Text>
                      <ArrowRight color={colors.white} size={18} />
                    </>
                  )}
                </TouchableOpacity>
              </>
            )}
          </View>

          {/* Quick Demo Personas Switcher */}
          <View style={styles.demoSection}>
            <View style={styles.demoHeaderRow}>
              <Sparkles color={colors.crimson} size={16} />
              <Text style={styles.demoSectionTitle}>1-CLICK DEMO SIGN IN</Text>
            </View>
            <Text style={styles.demoSectionSub}>
              Tap any member below to log in directly as them:
            </Text>

            <View style={styles.demoUsersList}>
              {users.map(user => {
                const isCurrentLoading = loadingUserId === user.id;
                return (
                  <TouchableOpacity
                    key={user.id}
                    style={[styles.demoUserCard, isCurrentLoading && styles.demoUserCardLoading]}
                    onPress={() => handleQuickDemoUserLogin(user)}
                    disabled={loadingUserId !== null || isLoggingIn || isSendingOtp}
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
                    <View style={[styles.loginPill, isCurrentLoading && styles.loginPillLoading]}>
                      {isCurrentLoading ? (
                        <>
                          <ActivityIndicator size="small" color={colors.white} style={{ transform: [{ scale: 0.75 }] }} />
                          <Text style={styles.loginPillLoadingText}>Logging In...</Text>
                        </>
                      ) : (
                        <Text style={styles.loginPillText}>Sign In ➔</Text>
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Apply for Council Membership CTA */}
          <View style={styles.signupBox}>
            <View style={styles.signupTextCol}>
              <Users2 color={colors.crimson} size={20} />
              <View style={styles.signupDetails}>
                <Text style={styles.signupTitle}>New to Bengal Business Council?</Text>
                <Text style={styles.signupSubtitle}>
                  Register for membership, get your digital visiting card, and join local chapters.
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.signUpBtn}
              onPress={() => navigation.navigate('SignUp')}
              activeOpacity={0.8}
            >
              <Text style={styles.signUpBtnText}>Register / Apply for Membership</Text>
            </TouchableOpacity>
          </View>

          {/* Footer Assistance */}
          <View style={styles.footerHelp}>
            <Text style={styles.helpText}>
              Need help? Call <Text style={styles.helpHighlight}>+91 (033) 4000-8800</Text> or email <Text style={styles.helpHighlight}>help@bengalbusinesscouncil.com</Text>
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
    marginBottom: 16,
    marginTop: 8,
  },
  loginEmblemWrapper: {
    width: 68,
    height: 68,
    borderRadius: 18,
    backgroundColor: '#07101E',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
  },
  loginEmblemImage: {
    width: 68,
    height: 68,
    borderRadius: 18,
  },
  brandLogoBox: {
    marginBottom: 14,
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
  btnDisabled: {
    opacity: 0.75,
  },
  demoUserCardLoading: {
    borderColor: colors.crimson,
    backgroundColor: '#FFF5F5',
  },
  loginPill: {
    backgroundColor: colors.crimsonLight,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.crimsonBorder,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  loginPillLoading: {
    backgroundColor: colors.crimson,
    borderColor: colors.crimson,
    paddingHorizontal: 8,
  },
  loginPillLoadingText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.white,
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
