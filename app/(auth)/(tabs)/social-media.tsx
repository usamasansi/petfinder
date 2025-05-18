import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useCheckAuthentication } from "@/hooks/useCheckAuthentication";
import {
  Button,
  Card,
  HelperText,
  SegmentedButtons,
  Text,
  TextInput,
} from "react-native-paper";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Container from "@/components/Container";
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useTranslation } from "react-i18next";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppTheme } from "@/lib/theme/Material3ThemeProvider";
import { isErrorsObjectEmpty } from "@/validation/helpers";
import { SocialMediaFormData, SocialMediaSchema } from "@/validation/socialMedia";
import { ThemedText } from "@/components/ThemedText";
import { toast } from "@backpackapp-io/react-native-toast";
import { useRouter } from "expo-router";
import useKeyboardState from "@/hooks/useKeyboardState";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import {
  getValueFromSecureStoreFor,
  saveItemInSecureStore,
} from "@/lib/utils";
import Icon from "react-native-vector-icons/FontAwesome5";
import { Image } from "expo-image";
import { blurhash } from "@/lib/utils";
import Constants from "expo-constants";

export default function SocialMediaIntegration() {
  const { authenticated, userId, loading } = useAuthStore((state) => state.authState);
  const router = useRouter();
  const { t } = useTranslation();
  const theme = useAppTheme();
  const { isKeyboardOpen } = useKeyboardState();
  const colorScheme = useColorScheme();
  const [image, setImage] = useState<string | null>(null);
  const [previewPlatform, setPreviewPlatform] = useState("twitter");

  if (loading) return null;

  console.log("🚀 ~ SocialMediaIntegration ~ userId:", userId);
  console.log("🚀 ~ SocialMediaIntegration ~ authenticated:", authenticated);

  useCheckAuthentication(authenticated);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SocialMediaFormData>({
    defaultValues: {
      postMessage: "",
      platforms: {
        facebook: false,
        instagram: false,
        twitter: false,
        linkedin: false,
      },
    },
    resolver: zodResolver(SocialMediaSchema(t)),
  });

  const postMessage = watch("postMessage");
  const platforms = watch("platforms");

  useEffect(() => {
    const loadSavedPlatforms = async () => {
      try {
        const savedPlatforms = await getValueFromSecureStoreFor("social_platforms");
        if (savedPlatforms) {
          const parsedPlatforms = JSON.parse(savedPlatforms);
          setValue("platforms", parsedPlatforms);
        }
      } catch (error) {
        console.error("Failed to load saved platforms:", error);
        toast.error(t("somethingWentWrong"));
      }
    };

    loadSavedPlatforms();
  }, [setValue, t]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const removeImage = () => {
    setImage(null);
  };

  const onSubmit = async (data: SocialMediaFormData) => {
    console.log("🚀 ~ onSubmit ~ data:", data);
    const { postMessage, platforms } = data;

    const selectedPlatforms = Object.keys(platforms).filter(
      (key) => platforms[key as keyof typeof platforms]
    );

    if (selectedPlatforms.length === 0) {
      toast.error(t("selectAtLeastOnePlatform"));
      return;
    }

    try {
      await saveItemInSecureStore("social_platforms", JSON.stringify(platforms));

      const apiKey = Constants.expoConfig?.extra?.AYRSHARE_API_KEY;
      if (!apiKey) {
        throw new Error("Ayrshare API key is missing. Please configure it in app.config.js or app.json.");
      }

      const postData: any = {
        post: postMessage,
        platforms: selectedPlatforms,
      };

      if (image) {
        // Note: Ayrshare expects a public URL. In production, upload the image to a server (e.g., AWS S3).
        postData.mediaUrls = [image];
      }

      const response = await axios.post(
        "https://app.ayrshare.com/api/post",
        postData,
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.status === "success") {
        toast.success(t("postSuccess"));
        setImage(null);
        setValue("postMessage", "");
      } else {
        toast.error(t("postFailed"));
      }
    } catch (error: any) {
      console.error("Error posting to social media:", error);
      if (error.response?.status === 403) {
        toast.error(t("invalidApiKeyOrPermissions"));
      } else {
        toast.error(t("somethingWentWrong"));
      }
    }
  };

  console.log("🚀 ~ SocialMediaIntegration ~ errors:", errors);

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: isSubmitting ? withSpring(0.95) : withSpring(1) }],
  }));

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case "facebook":
        return "#4267B2";
      case "instagram":
        return "#E1306C";
      case "twitter":
        return "#1DA1F2";
      case "linkedin":
        return "#0A66C2";
      default:
        return Colors[colorScheme ?? "light"].tint;
    }
  };

  return (
    <Container withHeader headerTitle={t("socialMediaTitle")}>
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
          <View style={[styles.container, { backgroundColor: Colors[colorScheme ?? "light"].background }]}>
            <Animated.View
              entering={FadeIn.duration(500).springify()}
              exiting={FadeOut.duration(500)}
            >
              <Card style={[styles.card, { backgroundColor: Colors[colorScheme ?? "light"].card }]}>
                <Card.Content>
                  <Controller
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <>
                        <TextInput
                          label={t("postMessage")}
                          onBlur={onBlur}
                          onChangeText={onChange}
                          value={value}
                          mode="outlined"
                          error={!!errors.postMessage}
                          multiline
                          numberOfLines={4}
                          returnKeyType="done"
                          autoCapitalize="sentences"
                          theme={{
                            colors: {
                              text: Colors[colorScheme ?? "light"].text,
                              background: Colors[colorScheme ?? "light"].card,
                              primary: Colors[colorScheme ?? "light"].tint,
                            },
                          }}
                        />
                        <ThemedText
                          style={[
                            styles.charCounter,
                            {
                              color:
                                value.length > 280
                                  ? theme.colors.error
                                  : value.length > 240
                                  ? "#FFA500"
                                  : Colors[colorScheme ?? "light"].text,
                            },
                          ]}
                        >
                          {value.length}/280
                        </ThemedText>
                      </>
                    )}
                    name="postMessage"
                  />
                  {errors.postMessage && (
                    <HelperText type="error" visible={!!errors.postMessage}>
                      {errors.postMessage.message}
                    </HelperText>
                  )}
                </Card.Content>
              </Card>
            </Animated.View>

            {image && (
              <Animated.View
                entering={FadeIn.duration(550).springify()}
                exiting={FadeOut.duration(550)}
                style={{ marginBottom: 10 }}
              >
                <Card style={[styles.card, { backgroundColor: Colors[colorScheme ?? "light"].card }]}>
                  <Card.Content style={styles.imageContainer}>
                    <Image
                      source={{ uri: image }}
                      style={styles.imageThumbnail}
                      placeholder={{ blurhash }}
                      contentFit="cover"
                      transition={500}
                    />
                    <Button
                      mode="outlined"
                      icon="close"
                      onPress={removeImage}
                      style={[styles.removeButton, { borderColor: theme.colors.error }]}
                      textColor="#FFFFFF"
                      buttonColor={Colors[colorScheme ?? "light"].card}
                      iconColor={theme.colors.error}
                    >
                      {t("removeImage")}
                    </Button>
                  </Card.Content>
                </Card>
              </Animated.View>
            )}

            <Animated.View
              entering={FadeIn.duration(600).springify()}
              exiting={FadeOut.duration(600)}
              style={{ marginBottom: 10 }}
            >
              <Card style={[styles.card, { backgroundColor: Colors[colorScheme ?? "light"].card }]}>
                <Card.Content>
                  <Button
                    mode="outlined"
                    onPress={pickImage}
                    icon="image"
                    style={{
                      borderColor: Colors[colorScheme ?? "light"].tint,
                    }}
                    textColor="#FFFFFF"
                    iconColor={Colors[colorScheme ?? "light"].iconColors.camera}
                  >
                    {image ? t("changeImage") : t("pickImage")}
                  </Button>
                </Card.Content>
              </Card>
            </Animated.View>

            <Animated.View
              entering={FadeIn.duration(650).springify()}
              exiting={FadeOut.duration(650)}
              style={{ marginBottom: 10 }}
            >
              <Card style={[styles.card, { backgroundColor: Colors[colorScheme ?? "light"].card }]}>
                <Card.Content>
                  <ThemedText
                    style={{
                      color: Colors[colorScheme ?? "light"].text,
                      marginBottom: 10,
                      fontWeight: "bold",
                    }}
                  >
                    {t("selectPlatforms")}
                  </ThemedText>
                  <View style={styles.platformContainer}>
                    {["facebook", "instagram", "twitter", "linkedin"].map((platform) => {
                      const scale = useSharedValue(platforms[platform] ? 1.1 : 1);

                      useEffect(() => {
                        scale.value = platforms[platform] ? withSpring(1.1) : withSpring(1);
                      }, [platforms[platform]]);

                      const animatedStyle = useAnimatedStyle(() => ({
                        transform: [{ scale: scale.value }],
                      }));

                      return (
                        <Controller
                          key={platform}
                          control={control}
                          render={({ field: { onChange, value } }) => (
                            <TouchableOpacity
                              style={[
                                styles.platformButton,
                                {
                                  backgroundColor: value
                                    ? getPlatformColor(platform)
                                    : Colors[colorScheme ?? "light"].card,
                                },
                              ]}
                              onPress={() => onChange(!value)}
                              activeOpacity={0.7}
                            >
                              <Animated.View style={animatedStyle}>
                                <Icon
                                  name={platform}
                                  size={24}
                                  color={
                                    value
                                      ? "#FFFFFF"
                                      : Colors[colorScheme ?? "light"].iconColors["share-social"]
                                  }
                                />
                              </Animated.View>
                            </TouchableOpacity>
                          )}
                          name={`platforms.${platform}` as keyof SocialMediaFormData["platforms"]}
                        />
                      );
                    })}
                  </View>
                  {errors.platforms && (
                    <HelperText type="error" visible={!!errors.platforms}>
                      {errors.platforms.message}
                    </HelperText>
                  )}
                </Card.Content>
              </Card>
            </Animated.View>

            <Animated.View
              entering={FadeIn.duration(700).springify()}
              exiting={FadeOut.duration(700)}
              style={{ marginBottom: 10 }}
            >
              <Card style={[styles.card, { backgroundColor: Colors[colorScheme ?? "light"].card }]}>
                <Card.Content>
                  <ThemedText
                    style={{
                      color: Colors[colorScheme ?? "light"].text,
                      marginBottom: 10,
                      fontWeight: "bold",
                    }}
                  >
                    {t("preview")}
                  </ThemedText>
                  <SegmentedButtons
                    value={previewPlatform}
                    onValueChange={setPreviewPlatform}
                    buttons={[
                      { value: "twitter", label: "X/Twitter" },
                      { value: "instagram", label: "Instagram" },
                      { value: "facebook", label: "Facebook" },
                      { value: "linkedin", label: "LinkedIn" },
                    ]}
                    style={styles.segmentedButtons}
                    theme={{
                      colors: {
                        primary: Colors[colorScheme ?? "light"].tint,
                        onPrimary: Colors[colorScheme ?? "light"].text,
                      },
                    }}
                  />
                  <View style={[styles.previewContainer, { borderColor: Colors[colorScheme ?? "light"].tint }]}>
                    {previewPlatform === "instagram" && image ? (
                      <View>
                        <Image
                          source={{ uri: image }}
                          style={styles.previewImage}
                          placeholder={{ blurhash }}
                          contentFit="cover"
                          transition={500}
                        />
                        <ThemedText
                          style={{
                            color: Colors[colorScheme ?? "light"].text,
                            marginTop: 5,
                          }}
                        >
                          {postMessage || t("previewPlaceholder")}
                        </ThemedText>
                      </View>
                    ) : (
                      <View>
                        <ThemedText
                          style={{
                            color: Colors[colorScheme ?? "light"].text,
                            marginBottom: 5,
                          }}
                        >
                          {postMessage || t("previewPlaceholder")}
                        </ThemedText>
                        {image && (
                          <Image
                            source={{ uri: image }}
                            style={styles.previewImage}
                            placeholder={{ blurhash }}
                            contentFit="cover"
                            transition={500}
                          />
                        )}
                        {previewPlatform === "twitter" && (
                          <ThemedText
                            style={{
                              color:
                                postMessage.length > 280
                                  ? theme.colors.error
                                  : Colors[colorScheme ?? "light"].text,
                            }}
                          >
                            {postMessage.length}/280
                          </ThemedText>
                        )}
                      </View>
                    )}
                  </View>
                </Card.Content>
              </Card>
            </Animated.View>

            <Animated.View
              entering={FadeIn.duration(750).springify()}
              exiting={FadeOut.duration(750)}
              style={[animatedButtonStyle, { marginBottom: 20 }]}
            >
              <Button
                mode="contained"
                disabled={isSubmitting}
                loading={isSubmitting}
                onPress={handleSubmit(onSubmit)}
                buttonColor={
                  isErrorsObjectEmpty(errors)
                    ? Colors[colorScheme ?? "light"].tint
                    : theme.colors.error
                }
                textColor="#FFFFFF"
                style={styles.postButton}
              >
                {t("postButton")}
              </Button>
            </Animated.View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  card: {
    marginBottom: 10,
    borderRadius: 8,
    elevation: 4,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  charCounter: {
    textAlign: "right",
    marginTop: 5,
    fontSize: 12,
  },
  imageContainer: {
    alignItems: "center",
  },
  imageThumbnail: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginBottom: 10,
  },
  removeButton: {
    borderWidth: 1,
  },
  platformContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  platformButton: {
    width: "22%",
    aspectRatio: 1,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  segmentedButtons: {
    marginBottom: 10,
  },
  previewContainer: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 8,
  },
  previewImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 5,
  },
  postButton: {
    borderRadius: 8,
    paddingVertical: 5,
  },
});