import React, { useContext } from "react";
import { useAuthStore } from "@/store/authStore";
import { useCheckAuthentication } from "@/hooks/useCheckAuthentication";
import { Button, HelperText, Text, TextInput } from "react-native-paper";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
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
import { blurhash, saveItemInSecureStore } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { jwtDecode } from "jwt-decode";
import { ThemedText } from "@/components/ThemedText";

export default function Login() {
  const { authenticated, userId } = useAuthStore((state) => state.authState);
  console.log("🚀 ~ Login ~ userId:", userId);
  console.log("🚀 ~ Login ~ authenticated:", authenticated);
  useCheckAuthentication(authenticated);

  const setAuthenticatedUser = useAuthStore(
    (state) => state.setAuthenticatedUser
  );

  const { t } = useTranslation();

  const {
    control,
    handleSubmit,
    setFocus,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(LoginSchema(t)),
  });
  const onSubmit = (data: LoginFormData) => {
    console.log("🚀 ~ onSubmit ~ data:", data);
    mutation.mutate(data);
  };

  console.log("🚀 ~ Login ~ errors:", errors);

  const theme = useAppTheme();

  const mutation = useMutation({
    mutationFn: (formData: LoginFormData) => {
      return api.post("http://localhost:3333/api/auth/local/signin", {
        email: formData.email,
        password: formData.password,
      });
    },
    onError: (error) => {
      console.log("🚀 ~ Login ~ error:", error);
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
                style={{ marginBottom: 10, alignSelf: "center" }}
              >
                <Button
                  mode="outlined"
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
                <ThemedText>test1234@test.test</ThemedText>
                <ThemedText>test1234</ThemedText>
              </Animated.View>
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
      </KeyboardAvoidingView>
    </Container>
  );
}
