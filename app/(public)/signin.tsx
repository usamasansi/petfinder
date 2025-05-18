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
import { SignUpFormData, SignUpSchema } from "@/validation/signup";
import {
  blurhash,
  getValueFromSecureStoreFor,
  saveItemInSecureStore,
} from "@/lib/utils";
import { ThemedText } from "@/components/ThemedText";
import { toast } from "@backpackapp-io/react-native-toast";
import { useRouter, Link } from "expo-router";
import useKeyboardState from "@/hooks/useKeyboardState";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function SignUp() {
  const { authenticated, userId, loading } = useAuthStore((state) => state.authState);
  const setAuthenticatedUser = useAuthStore((state) => state.setAuthenticatedUser);
  const router = useRouter();
  const { t } = useTranslation();
  const theme = useAppTheme();
  const { isKeyboardOpen } = useKeyboardState();
  const colorScheme = useColorScheme();

  if (loading) return null;

  console.log("🚀 ~ SignUp ~ userId:", userId);
  console.log("🚀 ~ SignUp ~ authenticated:", authenticated);

  useCheckAuthentication(authenticated);

  const {
    control,
    handleSubmit,
    setFocus,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    defaultValues: {
      email: "",
      username: "",
      password: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      rememberUser: false,
    },
    resolver: zodResolver(SignUpSchema(t)),
  });

  useEffect(() => {
    const getSavedSignUpFormData = async () => {
      try {
        const signUpEmail = await getValueFromSecureStoreFor("signup_email");
        const signUpPassword = await getValueFromSecureStoreFor("signup_password");

        if (signUpEmail) setValue("email", signUpEmail);
        if (signUpPassword) setValue("password", signUpPassword);
      } catch (error) {
        console.error("Failed to load saved credentials:", error);
        toast.error(t("somethingWentWrong"));
      }
    };

    getSavedSignUpFormData();
  }, [setValue, t]);

  const onSubmit = async (data: SignUpFormData) => {
    console.log("🚀 ~ onSubmit ~ data:", data);
    const { email, password, rememberUser } = data;

    // Simulate registration with hardcoded credentials
    const isValidSignUp = email === "signup@test.test" && password === "signup1234";

    if (isValidSignUp) {
      try {
        setAuthenticatedUser(true, 2); // Hardcoded userId for testing
        if (rememberUser) {
          await saveItemInSecureStore("signup_email", email);
          await saveItemInSecureStore("signup_password", password);
        }
        console.log("Navigating to /(auth)/(tabs)");
        router.replace("/(auth)/(tabs)");
        toast.success(t("signUpSuccess"));
      } catch (error) {
        console.error("Error during signup:", error);
        toast.error(t("somethingWentWrong"));
      }
    } else {
      toast.error(t("invalidSignUpCredentials"));
    }
  };

  console.log("🚀 ~ SignUp ~ errors:", errors);

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
                  color: Colors[colorScheme ?? 'light'].text,
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
                      onSubmitEditing={() => setFocus("username")}
                      ref={ref}
                      returnKeyType="next"
                      autoCapitalize="none"
                      keyboardType="email-address"
                      theme={{ colors: { text: Colors[colorScheme ?? 'light'].text, background: Colors[colorScheme ?? 'light'].card } }}
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
                    entering={FadeIn.duration(550)}
                    exiting={FadeOut.duration(550)}
                    style={{ marginBottom: 10 }}
                  >
                    <TextInput
                      label={t("username")}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      mode="outlined"
                      error={!!errors.username}
                      onSubmitEditing={() => setFocus("password")}
                      ref={ref}
                      returnKeyType="next"
                      autoCapitalize="none"
                      theme={{ colors: { text: Colors[colorScheme ?? 'light'].text, background: Colors[colorScheme ?? 'light'].card } }}
                    />
                    {errors.username && (
                      <HelperText type="error" visible={!!errors.username}>
                        {errors.username.message}
                      </HelperText>
                    )}
                  </Animated.View>
                )}
                name="username"
              />
              <Controller
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <Animated.View
                    entering={FadeIn.duration(600)}
                    exiting={FadeOut.duration(600)}
                    style={{ marginBottom: 10 }}
                  >
                    <TextInput
                      label={t("password")}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      mode="outlined"
                      error={!!errors.password}
                      onSubmitEditing={() => setFocus("firstName")}
                      ref={ref}
                      returnKeyType="next"
                      autoCapitalize="none"
                      secureTextEntry={true}
                      keyboardType="visible-password"
                      theme={{ colors: { text: Colors[colorScheme ?? 'light'].text, background: Colors[colorScheme ?? 'light'].card } }}
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
              <Controller
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <Animated.View
                    entering={FadeIn.duration(650)}
                    exiting={FadeOut.duration(650)}
                    style={{ marginBottom: 10 }}
                  >
                    <TextInput
                      label={t("firstName")}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      mode="outlined"
                      error={!!errors.firstName}
                      onSubmitEditing={() => setFocus("lastName")}
                      ref={ref}
                      returnKeyType="next"
                      autoCapitalize="words"
                      theme={{ colors: { text: Colors[colorScheme ?? 'light'].text, background: Colors[colorScheme ?? 'light'].card } }}
                    />
                    {errors.firstName && (
                      <HelperText type="error" visible={!!errors.firstName}>
                        {errors.firstName.message}
                      </HelperText>
                    )}
                  </Animated.View>
                )}
                name="firstName"
              />
              <Controller
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <Animated.View
                    entering={FadeIn.duration(700)}
                    exiting={FadeOut.duration(700)}
                    style={{ marginBottom: 10 }}
                  >
                    <TextInput
                      label={t("lastName")}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      mode="outlined"
                      error={!!errors.lastName}
                      onSubmitEditing={() => setFocus("phoneNumber")}
                      ref={ref}
                      returnKeyType="next"
                      autoCapitalize="words"
                      theme={{ colors: { text: Colors[colorScheme ?? 'light'].text, background: Colors[colorScheme ?? 'light'].card } }}
                    />
                    {errors.lastName && (
                      <HelperText type="error" visible={!!errors.lastName}>
                        {errors.lastName.message}
                      </HelperText>
                    )}
                  </Animated.View>
                )}
                name="lastName"
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
                      label={t("phoneNumber")}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      mode="outlined"
                      error={!!errors.phoneNumber}
                      onSubmitEditing={handleSubmit(onSubmit)}
                      ref={ref}
                      returnKeyType="done"
                      keyboardType="phone-pad"
                      theme={{ colors: { text: Colors[colorScheme ?? 'light'].text, background: Colors[colorScheme ?? 'light'].card } }}
                    />
                    {errors.phoneNumber && (
                      <HelperText type="error" visible={!!errors.phoneNumber}>
                        {errors.phoneNumber.message}
                      </HelperText>
                    )}
                  </Animated.View>
                )}
                name="phoneNumber"
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
                          color={Colors[colorScheme ?? 'light'].tint}
                        />
                        <ThemedText style={{ color: Colors[colorScheme ?? 'light'].text }}>
                          {t("saveLoginData")}
                        </ThemedText>
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
                    isErrorsObjectEmpty(errors) ? Colors[colorScheme ?? 'light'].tint : theme.colors.onError
                  }
                  style={{
                    borderColor: isErrorsObjectEmpty(errors)
                      ? Colors[colorScheme ?? 'light'].tint
                      : theme.colors.onError,
                  }}
                >
                  {t("signUp")}
                </Button>
              </Animated.View>
              <Link href="/(public)/login" asChild>
                <TouchableOpacity>
                  <ThemedText
                    style={{
                      textAlign: "center",
                      marginTop: 10,
                      color: Colors[colorScheme ?? 'light'].tint,
                      textDecorationLine: "underline",
                    }}
                  >
                    {t("loginLink")}
                  </ThemedText>
                </TouchableOpacity>
              </Link>
              <ThemedText style={{ color: Colors[colorScheme ?? 'light'].text, textAlign: "center", marginTop: 10 }}>
                signup@test.test
              </ThemedText>
              <ThemedText style={{ color: Colors[colorScheme ?? 'light'].text, textAlign: "center" }}>
                signup1234
              </ThemedText>
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