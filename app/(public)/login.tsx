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
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Container from "@/components/Container";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
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
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { jwtDecode } from "jwt-decode";
import { ThemedText } from "@/components/ThemedText";
import { AxiosError, isAxiosError } from "axios";
import { toast } from "@backpackapp-io/react-native-toast";
import { endpoints } from "@/lib/api/endpoints";

export default function Login() {
  const { authenticated, userId } = useAuthStore((state) => state.authState);
  console.log("🚀 ~ Login ~ userId:", userId);
  console.log("🚀 ~ Login ~ authenticated:", authenticated);
  useCheckAuthentication(authenticated);

  useEffect(() => {
    const getSavedLoginFormData = async () => {
      const loginEmail = await getValueFromSecureStoreFor("login_email");
      const loginPassword = await getValueFromSecureStoreFor("login_password");

      if (loginEmail) setValue("email", loginEmail);
      if (loginPassword) setValue("password", loginPassword);
    };

    getSavedLoginFormData();
  }, []);

  const setAuthenticatedUser = useAuthStore(
    (state) => state.setAuthenticatedUser
  );

  const { t } = useTranslation();

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

  const onSubmit = (data: LoginFormData) => {
    const { rememberUser } = data;

    console.log("🚀 ~ onSubmit ~ data:", data);
    mutation
      .mutateAsync(data)
      .then(() => {
        if (rememberUser) {
          saveItemInSecureStore("login_email", data.email);
          saveItemInSecureStore("login_password", data.password);
        }
      })
      .catch((error: Error | AxiosError) => {
        console.log("🚀 ~ mutation.mutateAsync ~ error:", error);
        if (isAxiosError(error)) {
          if (error.response?.data.message) {
            toast.error(error.response?.data.message);
          }
        } else {
          toast.error(t("somethingWentWrong"));
        }
      });
  };

  console.log("🚀 ~ Login ~ errors:", errors);

  const theme = useAppTheme();

  const mutation = useMutation({
    mutationFn: (formData: LoginFormData) => {
      return api.post(endpoints.public.login, {
        email: formData.email,
        password: formData.password,
      });
    },
    onSuccess: async (response) => {
      console.log("🚀 ~ Login ~ response:", response);
      const { refreshToken, accessToken } = response.data;

      await saveItemInSecureStore("access_token", accessToken);
      await saveItemInSecureStore("refresh_token", refreshToken);

      const decoded = jwtDecode(accessToken);
      console.log("🚀 ~ onSuccess: ~ decoded:", decoded);
      setAuthenticatedUser(true, Number(decoded.sub));
    },
  });

  return (
    <Container withHeader>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
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
                entering={FadeIn.duration(250)}
                exiting={FadeOut.duration(250)}
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                <Image
                  style={{ width: 150, height: 150 }}
                  source={Images.LogoImage}
                  placeholder={{ blurhash }}
                  contentFit="cover"
                  transition={1000}
                />
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
              </Animated.View>
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
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
                    {errors.email ? (
                      <HelperText type="error" visible={!!errors.email}>
                        {errors.email.message}
                      </HelperText>
                    ) : null}
                  </Animated.View>
                )}
                name="email"
              />

              <Controller
                control={control}
                rules={{
                  required: true,
                }}
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
                    {errors.password ? (
                      <HelperText type="error" visible={!!errors.password}>
                        {errors.password.message}
                      </HelperText>
                    ) : null}
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
                  rules={{
                    required: true,
                  }}
                  render={({ field: { onChange, value } }) => {
                    console.log("checkbox value", value);
                    return (
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
                        {errors.rememberUser ? (
                          <HelperText
                            type="error"
                            visible={!!errors.rememberUser}
                          >
                            {errors.rememberUser.message}
                          </HelperText>
                        ) : null}
                      </Animated.View>
                    );
                  }}
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
                    isErrorsObjectEmpty(errors)
                      ? undefined
                      : theme.colors.onError
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
