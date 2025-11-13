import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
  Modal,
} from 'react-native';
import { useSignIn, useSignUp, useOAuth } from '@clerk/clerk-expo';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useTranslation } from 'react-i18next';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS, FONT_SIZES } from '../constants/theme';
import { BlurView } from 'expo-blur';
import VerificationScreen from './VerificationScreen';
import * as WebBrowser from 'expo-web-browser';

// Nécessaire pour que le navigateur se ferme automatiquement après OAuth
WebBrowser.maybeCompleteAuthSession();

const AuthScreen = () => {
  const { t, i18n } = useTranslation();
  const { signIn, setActive: setActiveSignIn, isLoaded: signInLoaded } = useSignIn();
  const { signUp, setActive: setActiveSignUp, isLoaded: signUpLoaded } = useSignUp();
  const { startOAuthFlow: startGoogleOAuth } = useOAuth({ strategy: 'oauth_google' });
  const { startOAuthFlow: startFacebookOAuth } = useOAuth({ strategy: 'oauth_facebook' });

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<'google' | 'facebook' | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);
  const [showLanguagePicker, setShowLanguagePicker] = useState(false);

  const languages = [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'ht', name: 'Kreyòl', flag: '🇭🇹' },
  ];

  // Email validation
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSignIn = async () => {
    if (!signInLoaded) return;

    if (!email || !password) {
      Alert.alert(t('common.error'), t('auth.errorEmptyFields'));
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert(t('common.error'), t('auth.errorInvalidEmail'));
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    try {
      setLoading(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      const completeSignIn = await signIn.create({
        identifier: email,
        password,
      });

      await setActiveSignIn({ session: completeSignIn.createdSessionId });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (err: any) {
      console.error('Sign in error:', err);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert(
        t('common.error'),
        err.errors?.[0]?.message || t('auth.errorSignIn')
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!signUpLoaded) return;

    if (!email || !password || !firstName || !lastName) {
      Alert.alert(t('common.error'), t('auth.errorEmptyFields'));
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert(t('common.error'), t('auth.errorInvalidEmail'));
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    if (password.length < 8) {
      Alert.alert(t('common.error'), t('auth.errorPasswordLength'));
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    try {
      setLoading(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      // Générer un username à partir de l'email (avant le @)
      const username = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
      // Ajouter un timestamp pour garantir l'unicité
      const uniqueUsername = `${username}${Date.now().toString().slice(-4)}`;

      console.log('Creating sign up with:', { email, firstName, lastName, username: uniqueUsername });

      await signUp.create({
        emailAddress: email,
        password,
        firstName,
        lastName,
        username: uniqueUsername, // ← AJOUT DU USERNAME
      });

      console.log('Sign up created, status:', signUp.status);
      console.log('Missing fields:', signUp.missingFields);
      console.log('Unverified fields:', signUp.unverifiedFields);

      // Send email verification code
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setPendingVerification(true);
    } catch (err: any) {
      console.error('Sign up error:', err);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert(
        t('common.error'),
        err.errors?.[0]?.message || t('auth.errorSignUp')
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyEmail = async (code: string) => {
    if (!signUpLoaded || !signUp) {
      console.error('signUp not loaded or null');
      return;
    }

    try {
      console.log('Attempting email verification with code:', code);

      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      console.log('Verification response:', {
        status: completeSignUp.status,
        createdSessionId: completeSignUp.createdSessionId,
        missingFields: completeSignUp.missingFields,
        unverifiedFields: completeSignUp.unverifiedFields,
      });

      // Si status est "missing_requirements", il faut compléter avec update()
      if (completeSignUp.status === 'missing_requirements') {
        console.log('Missing requirements detected, updating sign up...');
        console.log('Missing fields:', completeSignUp.missingFields);

        // Générer un username si nécessaire
        const username = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
        const uniqueUsername = `${username}${Date.now().toString().slice(-4)}`;

        // Essayer de mettre à jour avec toutes les infos
        const updatedSignUp = await signUp.update({
          firstName: firstName,
          lastName: lastName,
          username: uniqueUsername, // ← AJOUT DU USERNAME
        });

        console.log('After update - status:', updatedSignUp.status);
        console.log('After update - createdSessionId:', updatedSignUp.createdSessionId);
        console.log('After update - missingFields:', updatedSignUp.missingFields);

        // Maintenant essayer de créer la session
        if (updatedSignUp.createdSessionId) {
          console.log('Activating session with ID:', updatedSignUp.createdSessionId);
          await setActiveSignUp({ session: updatedSignUp.createdSessionId });
          console.log('Session activated successfully - should redirect now');
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } else if (updatedSignUp.status === 'complete') {
          // Si complete, créer la session manuellement
          console.log('SignUp complete, creating session...');
          await setActiveSignUp({ session: updatedSignUp.createdSessionId! });
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } else {
          console.error('Still missing requirements after update:', updatedSignUp.missingFields);
          throw new Error('Informations manquantes après mise à jour');
        }
      } else if (completeSignUp.createdSessionId) {
        // Session créée directement
        console.log('Activating session with ID:', completeSignUp.createdSessionId);
        await setActiveSignUp({ session: completeSignUp.createdSessionId });
        console.log('Session activated successfully - should redirect now');
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else if (completeSignUp.status === 'complete') {
        // Parfois la session est déjà active
        console.log('SignUp complete but no session ID');
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        console.error('Unexpected verification state:', completeSignUp.status);
        throw new Error('Session non créée après vérification');
      }
    } catch (err: any) {
      console.error('Verification error:', err);
      console.error('Error details:', JSON.stringify(err, null, 2));
      throw err;
    }
  };

  const handleResendCode = async () => {
    if (!signUpLoaded) return;

    try {
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
    } catch (err: any) {
      // Si l'email est déjà vérifié, essayer de se connecter directement
      if (err.errors?.[0]?.code === 'verification_already_verified') {
        console.log('Email already verified, trying to sign in instead...');

        try {
          // Essayer de se connecter avec les credentials
          const result = await signIn.create({
            identifier: email,
            password,
          });

          if (result.createdSessionId) {
            await setActiveSignIn({ session: result.createdSessionId });
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            Alert.alert(t('common.success'), t('auth.successSignedIn'));
          }
        } catch (signInErr) {
          console.error('Sign in after verification error:', signInErr);
          Alert.alert(
            t('common.error'),
            t('auth.alreadyVerified')
          );
          // Retour à l'écran de connexion
          setPendingVerification(false);
          setIsSignUp(false);
        }
      } else {
        throw err;
      }
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setOauthLoading('google');
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      console.log('Starting Google OAuth flow...');

      // Utiliser le OAuth flow sans redirectUrl explicite
      // Clerk va utiliser automatiquement le scheme de l'app
      const result = await startGoogleOAuth();

      console.log('Google OAuth response:', {
        createdSessionId: result.createdSessionId,
        signInType: typeof result.signIn,
        signUpType: typeof result.signUp,
        setActive: !!result.setActive,
      });

      // Si createdSessionId est vide, c'est probablement qu'il manque le username
      if ((!result.createdSessionId || result.createdSessionId === '') && result.setActive) {
        console.log('No session ID - likely missing username requirement');

        // Vérifier si on a un signUp object (nouveau compte OAuth)
        if (typeof result.signUp === 'object' && result.signUp !== null) {
          console.log('OAuth SignUp detected, need to add username');

          try {
            // Générer un username à partir de l'email Google
            // Récupérer l'email depuis le signUp object
            const userEmail = result.signUp.emailAddress || '';
            console.log('Email from OAuth:', userEmail);

            if (userEmail) {
              const username = userEmail.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
              const uniqueUsername = `${username}${Date.now().toString().slice(-4)}`;

              console.log('Generated username for OAuth:', uniqueUsername);

              // Mettre à jour le signUp avec le username
              const updatedSignUp = await result.signUp.update({
                username: uniqueUsername,
              });

              console.log('SignUp updated with username, status:', updatedSignUp.status);

              // Maintenant récupérer le sessionId
              if (updatedSignUp.createdSessionId) {
                await result.setActive({ session: updatedSignUp.createdSessionId });
                console.log('Session activated successfully with username');
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                return; // Success!
              }
            }
          } catch (updateErr) {
            console.error('Failed to update OAuth user with username:', updateErr);
          }
        }

        // Si toujours pas de session, afficher erreur
        Alert.alert(
          t('common.error'),
          t('auth.errorOAuthIncomplete')
        );
        return;
      }

      // Si on a un sessionId directement (compte existant)
      if (result.createdSessionId && result.createdSessionId !== '') {
        if (result.setActive) {
          console.log('Activating session with ID:', result.createdSessionId);
          await result.setActive({ session: result.createdSessionId });
          console.log('Session activated successfully');
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } else {
          console.error('setActive is null');
          Alert.alert(t('common.error'), t('auth.errorActivateSession'));
        }
      }
    } catch (err: any) {
      console.error('Google OAuth error:', err);
      console.error('Error details:', JSON.stringify(err, null, 2));
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

      // Afficher l'erreur seulement si ce n'est pas une annulation
      if (!err.message?.includes('cancel') && !err.message?.includes('CANCELLED') && !err.message?.includes('User cancelled')) {
        Alert.alert(t('common.error'), err.message || t('auth.errorOAuth'));
      } else {
        console.log('OAuth cancelled by user');
      }
    } finally {
      setOauthLoading(null);
    }
  };

  const handleFacebookSignIn = async () => {
    try {
      setOauthLoading('facebook');
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      console.log('Starting Facebook OAuth flow...');

      // Utiliser le OAuth flow sans redirectUrl explicite
      const result = await startFacebookOAuth();

      console.log('Facebook OAuth response:', {
        createdSessionId: result.createdSessionId,
        signInType: typeof result.signIn,
        signUpType: typeof result.signUp,
        setActive: !!result.setActive,
      });

      // Si createdSessionId est vide, c'est probablement qu'il manque le username
      if ((!result.createdSessionId || result.createdSessionId === '') && result.setActive) {
        console.log('No session ID - likely missing username requirement');

        // Vérifier si on a un signUp object (nouveau compte OAuth)
        if (typeof result.signUp === 'object' && result.signUp !== null) {
          console.log('OAuth SignUp detected, need to add username');

          try {
            // Générer un username à partir de l'email Facebook
            const userEmail = result.signUp.emailAddress || '';
            console.log('Email from OAuth:', userEmail);

            if (userEmail) {
              const username = userEmail.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
              const uniqueUsername = `${username}${Date.now().toString().slice(-4)}`;

              console.log('Generated username for OAuth:', uniqueUsername);

              // Mettre à jour le signUp avec le username
              const updatedSignUp = await result.signUp.update({
                username: uniqueUsername,
              });

              console.log('SignUp updated with username, status:', updatedSignUp.status);

              // Maintenant récupérer le sessionId
              if (updatedSignUp.createdSessionId) {
                await result.setActive({ session: updatedSignUp.createdSessionId });
                console.log('Session activated successfully with username');
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                return; // Success!
              }
            }
          } catch (updateErr) {
            console.error('Failed to update OAuth user with username:', updateErr);
          }
        }

        // Si toujours pas de session, afficher erreur
        Alert.alert(
          t('common.error'),
          t('auth.errorOAuthIncompleteFacebook')
        );
        return;
      }

      // Si on a un sessionId directement (compte existant)
      if (result.createdSessionId && result.createdSessionId !== '') {
        if (result.setActive) {
          console.log('Activating session with ID:', result.createdSessionId);
          await result.setActive({ session: result.createdSessionId });
          console.log('Session activated successfully');
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } else {
          console.error('setActive is null');
          Alert.alert(t('common.error'), t('auth.errorActivateSession'));
        }
      }
    } catch (err: any) {
      console.error('Facebook OAuth error:', err);
      console.error('Error details:', JSON.stringify(err, null, 2));
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

      // Afficher l'erreur seulement si ce n'est pas une annulation
      if (!err.message?.includes('cancel') && !err.message?.includes('CANCELLED')) {
        Alert.alert(t('common.error'), err.message || t('auth.errorOAuthFacebook'));
      }
    } finally {
      setOauthLoading(null);
    }
  };

  const toggleMode = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsSignUp(!isSignUp);
    // Reset fields
    setEmail('');
    setPassword('');
    setFirstName('');
    setLastName('');
    setPendingVerification(false);
  };

  const togglePasswordVisibility = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowPassword(!showPassword);
  };

  const handleLanguageSelect = (languageCode: string) => {
    setSelectedLanguage(languageCode);
    i18n.changeLanguage(languageCode);
    setShowLanguagePicker(false);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const getSelectedLanguageName = () => {
    const lang = languages.find(l => l.code === selectedLanguage);
    return lang ? `${lang.flag} ${lang.name}` : 'Select Language';
  };

  // Show verification screen if pending
  if (pendingVerification) {
    return (
      <VerificationScreen
        email={email}
        onVerify={handleVerifyEmail}
        onResend={handleResendCode}
        onBack={() => setPendingVerification(false)}
      />
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      {/* Background Gradient */}
      <LinearGradient
        colors={[COLORS.primary[900], COLORS.primary[700], COLORS.accent.blue]}
        style={StyleSheet.absoluteFillObject}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Logo Section */}
        <Animated.View entering={FadeInUp.delay(200)} style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <LinearGradient
              colors={[COLORS.accent.blue, COLORS.accent.indigo]}
              style={styles.logoGradient}
            >
              <Ionicons name="cube" size={64} color={COLORS.text.primary} />
            </LinearGradient>
          </View>
          <Text style={styles.logoText}>{t('auth.appName')}</Text>
          <Text style={styles.tagline}>
            {isSignUp ? t('auth.taglineSignUp') : t('auth.taglineSignIn')}
          </Text>
        </Animated.View>

        {/* OAuth Buttons */}
        <Animated.View entering={FadeInDown.delay(300)} style={styles.oauthContainer}>
          <TouchableOpacity
            onPress={handleGoogleSignIn}
            disabled={oauthLoading !== null}
            activeOpacity={0.8}
            style={styles.oauthButton}
          >
            <BlurView intensity={20} tint="dark" style={styles.oauthBlur}>
              {oauthLoading === 'google' ? (
                <ActivityIndicator color={COLORS.text.primary} />
              ) : (
                <>
                  <Ionicons name="logo-google" size={24} color="#EA4335" />
                  <Text style={styles.oauthButtonText}>{t('auth.continueGoogle')}</Text>
                </>
              )}
            </BlurView>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleFacebookSignIn}
            disabled={oauthLoading !== null}
            activeOpacity={0.8}
            style={styles.oauthButton}
          >
            <BlurView intensity={20} tint="dark" style={styles.oauthBlur}>
              {oauthLoading === 'facebook' ? (
                <ActivityIndicator color={COLORS.text.primary} />
              ) : (
                <>
                  <Ionicons name="logo-facebook" size={24} color="#1877F2" />
                  <Text style={styles.oauthButtonText}>{t('auth.continueFacebook')}</Text>
                </>
              )}
            </BlurView>
          </TouchableOpacity>
        </Animated.View>

        {/* Divider */}
        <Animated.View entering={FadeInDown.delay(350)} style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>{t('auth.dividerOr')}</Text>
          <View style={styles.dividerLine} />
        </Animated.View>

        {/* Form Card */}
        <Animated.View entering={FadeInDown.delay(400)} style={styles.formCard}>
          <BlurView intensity={20} tint="dark" style={styles.blurContainer}>
            <View style={styles.formContent}>
              {/* Sign Up Fields */}
              {isSignUp && (
                <>
                  <View style={styles.inputContainer}>
                    <Ionicons
                      name="person-outline"
                      size={20}
                      color={COLORS.text.tertiary}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder={t('auth.firstName')}
                      placeholderTextColor={COLORS.text.tertiary}
                      value={firstName}
                      onChangeText={setFirstName}
                      autoCapitalize="words"
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Ionicons
                      name="person-outline"
                      size={20}
                      color={COLORS.text.tertiary}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder={t('auth.lastName')}
                      placeholderTextColor={COLORS.text.tertiary}
                      value={lastName}
                      onChangeText={setLastName}
                      autoCapitalize="words"
                    />
                  </View>

                  {/* Language Selector */}
                  <TouchableOpacity
                    onPress={() => setShowLanguagePicker(true)}
                    activeOpacity={0.7}
                    style={styles.inputContainer}
                  >
                    <Ionicons
                      name="language-outline"
                      size={20}
                      color={COLORS.text.tertiary}
                      style={styles.inputIcon}
                    />
                    <Text style={styles.languageText}>{getSelectedLanguageName()}</Text>
                    <Ionicons
                      name="chevron-down"
                      size={20}
                      color={COLORS.text.tertiary}
                      style={styles.chevronIcon}
                    />
                  </TouchableOpacity>
                </>
              )}

              {/* Email Input */}
              <View style={styles.inputContainer}>
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color={COLORS.text.tertiary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder={t('auth.email')}
                  placeholderTextColor={COLORS.text.tertiary}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                />
              </View>

              {/* Password Input */}
              <View style={styles.inputContainer}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={COLORS.text.tertiary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.input, styles.passwordInput]}
                  placeholder={t('auth.password')}
                  placeholderTextColor={COLORS.text.tertiary}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={togglePasswordVisibility}
                  style={styles.eyeIcon}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                    size={20}
                    color={COLORS.text.tertiary}
                  />
                </TouchableOpacity>
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                onPress={isSignUp ? handleSignUp : handleSignIn}
                disabled={loading}
                activeOpacity={0.8}
                style={styles.submitButtonWrapper}
              >
                <LinearGradient
                  colors={[COLORS.accent.blue, COLORS.accent.indigo]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.submitButton}
                >
                  {loading ? (
                    <ActivityIndicator color={COLORS.text.primary} />
                  ) : (
                    <>
                      <Text style={styles.submitButtonText}>
                        {isSignUp ? t('auth.signUp') : t('auth.signIn')}
                      </Text>
                      <Ionicons name="arrow-forward" size={20} color={COLORS.text.primary} />
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              {/* Toggle Mode */}
              <View style={styles.toggleContainer}>
                <Text style={styles.toggleText}>
                  {isSignUp ? t('auth.hasAccount') : t('auth.noAccount')}
                </Text>
                <TouchableOpacity onPress={toggleMode} activeOpacity={0.7}>
                  <Text style={styles.toggleButton}>
                    {isSignUp ? t('auth.signIn') : t('auth.signUp')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </BlurView>
        </Animated.View>

        {/* Features */}
        <Animated.View entering={FadeInUp.delay(600)} style={styles.features}>
          {[
            { icon: 'shield-checkmark', text: t('auth.featureSecure') },
            { icon: 'flash', text: t('auth.featureFast') },
            { icon: 'globe', text: t('auth.featureGlobal') },
          ].map((feature, index) => (
            <View key={index} style={styles.feature}>
              <Ionicons name={feature.icon as any} size={20} color={COLORS.accent.blue} />
              <Text style={styles.featureText}>{feature.text}</Text>
            </View>
          ))}
        </Animated.View>
      </ScrollView>

      {/* Language Picker Modal */}
      <Modal
        visible={showLanguagePicker}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowLanguagePicker(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setShowLanguagePicker(false)}
          style={styles.modalOverlay}
        >
          <View style={styles.languagePickerContainer}>
            <BlurView intensity={40} tint="dark" style={styles.languagePickerBlur}>
              <Text style={styles.languagePickerTitle}>Choose Language</Text>
              {languages.map((language) => (
                <TouchableOpacity
                  key={language.code}
                  onPress={() => handleLanguageSelect(language.code)}
                  activeOpacity={0.7}
                  style={[
                    styles.languageOption,
                    selectedLanguage === language.code && styles.languageOptionSelected,
                  ]}
                >
                  <Text style={styles.languageFlag}>{language.flag}</Text>
                  <Text style={[
                    styles.languageOptionText,
                    selectedLanguage === language.code && styles.languageOptionTextSelected,
                  ]}>
                    {language.name}
                  </Text>
                  {selectedLanguage === language.code && (
                    <Ionicons name="checkmark-circle" size={24} color={COLORS.accent.blue} />
                  )}
                </TouchableOpacity>
              ))}
            </BlurView>
          </View>
        </TouchableOpacity>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.primary,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING['5xl'],
    paddingBottom: SPACING['3xl'],
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: SPACING['2xl'],
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    marginBottom: SPACING.lg,
    ...SHADOWS.xl,
  },
  logoGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: FONT_SIZES['3xl'],
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  tagline: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text.secondary,
  },
  oauthContainer: {
    gap: SPACING.base,
    marginBottom: SPACING.xl,
  },
  oauthButton: {
    borderRadius: BORDER_RADIUS.base,
    overflow: 'hidden',
    ...SHADOWS.md,
  },
  oauthBlur: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.base,
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border.light,
  },
  oauthButtonText: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border.light,
  },
  dividerText: {
    marginHorizontal: SPACING.base,
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.tertiary,
    fontWeight: '500',
  },
  formCard: {
    borderRadius: BORDER_RADIUS.xl,
    overflow: 'hidden',
    ...SHADOWS.lg,
    marginBottom: SPACING['2xl'],
  },
  blurContainer: {
    borderRadius: BORDER_RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border.light,
  },
  formContent: {
    padding: SPACING.xl,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.gray[800],
    borderRadius: BORDER_RADIUS.base,
    paddingHorizontal: SPACING.base,
    marginBottom: SPACING.base,
    borderWidth: 1,
    borderColor: COLORS.border.light,
  },
  inputIcon: {
    marginRight: SPACING.sm,
  },
  input: {
    flex: 1,
    height: 56,
    fontSize: FONT_SIZES.base,
    color: COLORS.text.primary,
  },
  passwordInput: {
    paddingRight: SPACING['2xl'],
  },
  eyeIcon: {
    position: 'absolute',
    right: SPACING.base,
    padding: SPACING.sm,
  },
  submitButtonWrapper: {
    marginTop: SPACING.base,
    marginBottom: SPACING.lg,
  },
  submitButton: {
    height: 56,
    borderRadius: BORDER_RADIUS.base,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.md,
  },
  submitButtonText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginRight: SPACING.sm,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.secondary,
    marginRight: SPACING.xs,
  },
  toggleButton: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.accent.blue,
  },
  features: {
    gap: SPACING.base,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
  },
  featureText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.secondary,
  },
  // Language selector styles
  languageText: {
    flex: 1,
    fontSize: FONT_SIZES.base,
    color: COLORS.text.primary,
    paddingVertical: SPACING.sm,
  },
  chevronIcon: {
    marginLeft: 'auto',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  languagePickerContainer: {
    width: '100%',
    maxWidth: 320,
    borderRadius: BORDER_RADIUS.xl,
    overflow: 'hidden',
  },
  languagePickerBlur: {
    padding: SPACING.xl,
  },
  languagePickerTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.base,
    borderRadius: BORDER_RADIUS.base,
    marginBottom: SPACING.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  languageOptionSelected: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderWidth: 1,
    borderColor: COLORS.accent.blue,
  },
  languageFlag: {
    fontSize: 28,
    marginRight: SPACING.md,
  },
  languageOptionText: {
    flex: 1,
    fontSize: FONT_SIZES.base,
    color: COLORS.text.secondary,
  },
  languageOptionTextSelected: {
    color: COLORS.text.primary,
    fontWeight: '600',
  },
});

export default AuthScreen;
