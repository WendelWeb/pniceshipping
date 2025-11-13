import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { BlurView } from 'expo-blur';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS, FONT_SIZES } from '../constants/theme';

interface VerificationScreenProps {
  email: string;
  onVerify: (code: string) => Promise<void>;
  onResend: () => Promise<void>;
  onBack: () => void;
}

const VerificationScreen: React.FC<VerificationScreenProps> = ({
  email,
  onVerify,
  onResend,
  onBack,
}) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const handleVerify = async () => {
    if (code.length !== 6) {
      Alert.alert('Erreur', 'Le code doit contenir 6 chiffres');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    try {
      setLoading(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      await onVerify(code);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (err: any) {
      console.error('Verification error:', err);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Erreur', err.errors?.[0]?.message || 'Code de vérification incorrect');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setResending(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      await onResend();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Succès', 'Un nouveau code a été envoyé à votre email');
    } catch (err) {
      console.error('Resend error:', err);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Erreur', "Impossible de renvoyer le code");
    } finally {
      setResending(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[COLORS.primary[900], COLORS.primary[700], COLORS.accent.blue]}
        style={StyleSheet.absoluteFillObject}
      />

      <View style={styles.content}>
        {/* Header */}
        <Animated.View entering={FadeInDown.delay(200)} style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={COLORS.text.primary} />
          </TouchableOpacity>

          <View style={styles.iconContainer}>
            <LinearGradient
              colors={[COLORS.accent.blue, COLORS.accent.indigo]}
              style={styles.iconGradient}
            >
              <Ionicons name="mail" size={48} color={COLORS.text.primary} />
            </LinearGradient>
          </View>

          <Text style={styles.title}>Vérifiez votre email</Text>
          <Text style={styles.subtitle}>
            Nous avons envoyé un code à 6 chiffres à
          </Text>
          <Text style={styles.email}>{email}</Text>
        </Animated.View>

        {/* Code Input */}
        <Animated.View entering={FadeInDown.delay(400)} style={styles.formCard}>
          <BlurView intensity={20} tint="dark" style={styles.blurContainer}>
            <View style={styles.formContent}>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="000000"
                  placeholderTextColor={COLORS.text.quaternary}
                  value={code}
                  onChangeText={(text) => setCode(text.replace(/[^0-9]/g, '').slice(0, 6))}
                  keyboardType="number-pad"
                  maxLength={6}
                  autoFocus
                />
              </View>

              {/* Verify Button */}
              <TouchableOpacity
                onPress={handleVerify}
                disabled={loading || code.length !== 6}
                activeOpacity={0.8}
                style={styles.submitButtonWrapper}
              >
                <LinearGradient
                  colors={
                    code.length === 6
                      ? [COLORS.accent.blue, COLORS.accent.indigo]
                      : [COLORS.gray[700], COLORS.gray[700]]
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.submitButton}
                >
                  {loading ? (
                    <ActivityIndicator color={COLORS.text.primary} />
                  ) : (
                    <>
                      <Text style={styles.submitButtonText}>Vérifier</Text>
                      <Ionicons name="checkmark-circle" size={20} color={COLORS.text.primary} />
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              {/* Resend */}
              <View style={styles.resendContainer}>
                <Text style={styles.resendText}>Vous n'avez pas reçu le code ?</Text>
                <TouchableOpacity
                  onPress={handleResend}
                  disabled={resending}
                  activeOpacity={0.7}
                >
                  <Text style={styles.resendButton}>
                    {resending ? 'Envoi...' : 'Renvoyer'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </BlurView>
        </Animated.View>

        {/* Info */}
        <Animated.View entering={FadeInDown.delay(600)} style={styles.info}>
          <Ionicons name="information-circle" size={20} color={COLORS.text.tertiary} />
          <Text style={styles.infoText}>
            Le code expire dans 10 minutes. Vérifiez vos spams si vous ne le voyez pas.
          </Text>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING['3xl'],
    paddingBottom: SPACING['2xl'],
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING['3xl'],
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 0,
    padding: SPACING.sm,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    marginBottom: SPACING.lg,
    ...SHADOWS.lg,
  },
  iconGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: FONT_SIZES['3xl'],
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: FONT_SIZES.base,
    color: COLORS.text.secondary,
    textAlign: 'center',
  },
  email: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.accent.blue,
    marginTop: SPACING.xs,
  },
  formCard: {
    borderRadius: BORDER_RADIUS.xl,
    overflow: 'hidden',
    ...SHADOWS.lg,
    marginBottom: SPACING.xl,
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
    backgroundColor: COLORS.gray[800],
    borderRadius: BORDER_RADIUS.base,
    paddingHorizontal: SPACING.base,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border.light,
  },
  input: {
    height: 72,
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.text.primary,
    textAlign: 'center',
    letterSpacing: 8,
  },
  submitButtonWrapper: {
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
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resendText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.secondary,
    marginRight: SPACING.xs,
  },
  resendButton: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.accent.blue,
  },
  info: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
    padding: SPACING.base,
    backgroundColor: COLORS.gray[800],
    borderRadius: BORDER_RADIUS.base,
    borderWidth: 1,
    borderColor: COLORS.border.light,
  },
  infoText: {
    flex: 1,
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.tertiary,
    lineHeight: 20,
  },
});

export default VerificationScreen;
