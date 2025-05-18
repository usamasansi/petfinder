import React, { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { useCheckAuthentication } from "@/hooks/useCheckAuthentication";
import {
  Button,
  Checkbox,
  HelperText,
  Text,
  TextInput,
} from "react-native-paper";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Container from "@/components/Container";
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { Image } from "expo-image";
import { Images } from "@/assets/images";
import { Keyboard } from "react-native";
import { useTranslation } from "react-i18next";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppTheme } from "@/lib/theme/Material3ThemeProvider";
import { isErrorsObjectEmpty } from "@/validation/helpers";
import { LoginFormData, LoginSchema } from "@/validation/login";
import {
  blurhash,
  getValueFromSecureStoreFor,
  saveItemInSecureStore,
} from "@/lib/utils";
import { ThemedText } from "@/components/ThemedText";
import { toast } from "@backpackapp-io/react-native-toast";
import { useRouter } from "expo-router";
import useKeyboardState from "@/hooks/useKeyboardState";

export default function Login() {
  // Auth state from zustand store
  const { authenticated, userId, loading } = useAuthStore((state) => state.authState);
  const setAuthenticatedUser = useAuthStore((state) => state.setAuthenticatedUser);
  const router = useRouter();
  const { t } = useTranslation();
  const theme = useAppTheme();
  const { isKeyboardOpen } = useKeyboardState();

  // Prevent rendering until auth state is loaded
  if (loading) return null;

  console.log("🚀 ~ Login ~ userId:", userId);
  console.log("🚀 ~ Login ~ authenticated:", authenticated);

  // Redirect authenticated users
  useCheckAuthentication(authenticated);

  // Form setup with react-hook-form and zod validation
  const {
    control,
    handleSubmit,
    setFocus,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    defaultValues: {
      email: "",
      password: "",
      rememberUser: false,
    },
    resolver: zodResolver(LoginSchema(t)),
  });

  // Load saved credentials from SecureStore
  useEffect(() => {
    const getSavedLoginFormData = async () => {
      try {
        const loginEmail = await getValueFromSecureStoreFor("login_email");
        const loginPassword = await getValueFromSecureStoreFor("login_password");

        if (loginEmail) setValue("email", loginEmail);
        if (loginPassword) setValue("password", loginPassword);
      } catch (error) {
        console.error("Failed to load saved credentials:", error);
        toast.error(t("somethingWentWrong"));
      }
    };

    getSavedLoginFormData();
  }, [setValue, t]);

  // Handle form submission
  const onSubmit = async (data: LoginFormData) => {
    console.log("🚀 ~ onSubmit ~ data:", data);
    const { email, password, rememberUser } = data;

    // Simulate login with hardcoded credentials
    const isValidLogin = email === "test1234@test.test" && password === "test1234";

    if (isValidLogin) {
      try {
        // Update auth state
        setAuthenticatedUser(true, 1); // Hardcoded userId for testing
        // Save credentials if rememberUser is checked
        if (rememberUser) {
          await saveItemInSecureStore("login_email", email);
          await saveItemInSecureStore("login_password", password);
        }
        // Navigate to tabs
        console.log("Navigating to /(auth)/(tabs)");
        router.replace("/(auth)/(tabs)");
        toast.success(t("loginSuccess"));
      } catch (error) {
        console.error("Error during login:", error);
        toast.error(t("somethingWentWrong"));
      }
    } else {
      toast.error(t("invalidCredentials"));
    }
  };

  // Log form errors for debugging
  console.log("🚀 ~ Login ~ errors:", errors);

  // Animated style for logo container
  const animatedStyle = useAnimatedStyle(() => ({
    height: withTiming(isKeyboardOpen ? 0 : 150, { duration: 250 }),
    opacity: withTiming(isKeyboardOpen ? 0 : 1, { duration: 250 }),
  }));

  return (
    <Container withHeader>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          bounces={false}
          contentInsetAdjustmentBehavior="always"
          overScrollMode="always"
          showsVerticalScrollIndicator={true}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View>
              <Animated.View
                key="uniqueKey"
                style={[styles.animationContainer, animatedStyle]}
              >
                <Image
                  style={styles.logo}
                  source={Images.LogoImage}
                  placeholder={{ blurhash }}
                  contentFit="cover"
                  transition={1000}
                />
              </Animated.View>
              <Text
                variant="headlineLarge"
                style={{
                  textAlign: "center",
                  marginBottom: 10,
                  fontFamily: "Lobster",
                }}
              >
                {t("appName")}
              </Text>
              <Controller
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <Animated.View
                    entering={FadeIn.duration(500)}
                    exiting={FadeOut.duration(500)}
                    style={{ marginBottom: 10 }}
                  >
                    <TextInput
                      label={t("email")}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      mode="outlined"
                      error={!!errors.email}
                      onSubmitEditing={() => setFocus("password")}
                      ref={ref}
                      returnKeyType="next"
                      autoCapitalize="none"
                      keyboardType="email-address"
                    />
                    {errors.email && (
                      <HelperText type="error" visible={!!errors.email}>
                        {errors.email.message}
                      </HelperText>
                    )}
                  </Animated.View>
                )}
                name="email"
              />
              <Controller
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <Animated.View
                    entering={FadeIn.duration(750)}
                    exiting={FadeOut.duration(750)}
                    style={{ marginBottom: 10 }}
                  >
                    <TextInput
                      label={t("password")}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      mode="outlined"
                      error={!!errors.password}
                      onSubmitEditing={handleSubmit(onSubmit)}
                      ref={ref}
                      returnKeyType="done"
                      autoCapitalize="none"
                      secureTextEntry={true}
                      keyboardType="visible-password"
                    />
                    {errors.password && (
                      <HelperText type="error" visible={!!errors.password}>
                        {errors.password.message}
                      </HelperText>
                    )}
                  </Animated.View>
                )}
                name="password"
              />
              <Animated.View
                entering={FadeIn.duration(850)}
                exiting={FadeOut.duration(850)}
                style={{
                  marginBottom: 10,
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexDirection: "row",
                  gap: 18,
                }}
              >
                <Controller
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Animated.View
                      entering={FadeIn.duration(750)}
                      exiting={FadeOut.duration(750)}
                    >
                      <TouchableOpacity
                        style={{
                          justifyContent: "center",
                          alignItems: "center",
                          flexDirection: "row",
                        }}
                        onPress={() => onChange(!value)}
                        activeOpacity={0.7}
                      >
                        <Checkbox.Android
                          status={value ? "checked" : "unchecked"}
                          onPress={() => onChange(!value)}
                        />
                        <ThemedText>{t("saveLoginData")}</ThemedText>
                      </TouchableOpacity>
                      {errors.rememberUser && (
                        <HelperText type="error" visible={!!errors.rememberUser}>
                          {errors.rememberUser.message}
                        </HelperText>
                      )}
                    </Animated.View>
                  )}
                  name="rememberUser"
                />
                <Button
                  mode="outlined"
                  disabled={isSubmitting}
                  loading={isSubmitting}
                  onPress={handleSubmit(onSubmit)}
                  buttonColor={
                    isErrorsObjectEmpty(errors) ? undefined : theme.colors.error
                  }
                  textColor={
                    isErrorsObjectEmpty(errors) ? undefined : theme.colors.onError
                  }
                  style={{
                    borderColor: isErrorsObjectEmpty(errors)
                      ? theme.colors.outline
                      : theme.colors.onError,
                  }}
                >
                  {t("login")}
                </Button>
              </Animated.View>
              <ThemedText>test1234@test.test</ThemedText>
              <ThemedText>test1234</ThemedText>
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
      </KeyboardAvoidingView>
    </Container>
  );
}

const styles = StyleSheet.create({
  animationContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    zIndex: 1,
    overflow: "hidden",
  },
  logo: {
    width: 150,
    height: 150,
  },
});