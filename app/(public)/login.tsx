import React from "react";
import { useAuthStore } from "@/store/authStore";
import { useCheckAuthenticated } from "@/hooks/useCheckAuthenticated";
import { Button, HelperText, Text, TextInput } from "react-native-paper";
import {
  KeyboardAvoidingView,
  Platform,
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
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

type FormData = {
  email: string;
  password: string;
};

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export default function Login() {
  const { authenticated } = useAuthStore((state) => state.authState);

  useCheckAuthenticated(authenticated);

  const { t } = useTranslation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(LoginSchema),
  });
  const onSubmit = (data: FormData) => console.log(data);

  console.log("🚀 ~ Login ~ errors:", errors);

  return (
    <Container withHeader>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
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
              render={({ field: { onChange, onBlur, value } }) => (
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
              render={({ field: { onChange, onBlur, value } }) => (
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
              <Button mode="outlined" onPress={handleSubmit(onSubmit)}>
                {t("login")}
              </Button>
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Container>
  );
}
