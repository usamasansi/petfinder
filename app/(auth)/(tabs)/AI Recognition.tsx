import React, { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useCheckAuthentication } from "@/hooks/useCheckAuthentication";
import {
  Button,
  Card,
  HelperText,
  Text,
} from "react-native-paper";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
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
import { ThemedText } from "@/components/ThemedText";
import { toast } from "@backpackapp-io/react-native-toast";
import { useRouter } from "expo-router";
import useKeyboardState from "@/hooks/useKeyboardState";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
import { blurhash } from "@/lib/utils";
import { useAppTheme } from "@/lib/theme/Material3ThemeProvider";

export default function AIRecognition() {
  const { authenticated, userId, loading } = useAuthStore((state) => state.authState);
  const router = useRouter();
  const { t } = useTranslation();
  const theme = useAppTheme();
  const { isKeyboardOpen } = useKeyboardState();
  const colorScheme = useColorScheme();
  const [image, setImage] = useState<string | null>(null);
  const [isRecognizing, setIsRecognizing] = useState(false);

  if (loading) return null;

  console.log("🚀 ~ AIRecognition ~ userId:", userId);
  console.log("🚀 ~ AIRecognition ~ authenticated:", authenticated);

  useCheckAuthentication(authenticated);

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

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      toast.error(t("cameraPermissionRequired"));
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
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

  const onRecognize = async () => {
    if (!image) {
      toast.error(t("imageRequired"));
      return;
    }

    setIsRecognizing(true);
    try {
      // Placeholder: Add your AI recognition API call here
      // e.g., const response = await axios.post("/api/ai-recognize", { image });
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate network delay
      toast.success(t("recognitionSuccess"));
    } catch (error) {
      console.error("Error in AI recognition:", error);
      toast.error(t("somethingWentWrong"));
    } finally {
      setIsRecognizing(false);
    }
  };

  const onShare = () => {
    if (!image) {
      toast.error(t("imageRequired"));
      return;
    }

    const message = t("shareMessage");

    router.push({
      pathname: "/(auth)/(tabs)/social-media",
      params: { message, image },
    });
  };

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: isRecognizing ? withSpring(0.95) : withSpring(1) }],
  }));

  return (
    <Container withHeader headerTitle={t("aiRecognitionTitle")}>
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
              style={{ marginBottom: 10 }}
            >
              <Card style={[styles.card, { backgroundColor: Colors[colorScheme ?? "light"].card }]}>
                <Card.Content style={styles.buttonContainer}>
                  <Button
                    mode="outlined"
                    onPress={pickImage}
                    icon="image"
                    style={[styles.actionButton, {
                      borderColor: Colors[colorScheme ?? "light"].tint,
                    }]}
                    textColor="#FFFFFF"
                    iconColor={Colors[colorScheme ?? "light"].iconColors.camera}
                  >
                    {image ? t("changeImage") : t("pickImage")}
                  </Button>
                  <Button
                    mode="outlined"
                    onPress={takePhoto}
                    icon="camera"
                    style={[styles.actionButton, {
                      borderColor: Colors[colorScheme ?? "light"].tint,
                    }]}
                    textColor="#FFFFFF"
                    iconColor={Colors[colorScheme ?? "light"].iconColors.camera}
                  >
                    {t("takePhoto")}
                  </Button>
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
                      style={[styles.removeButton, { borderColor: Colors[colorScheme ?? "light"].iconColors["alert-circle"] }]}
                      textColor="#FFFFFF"
                      buttonColor={Colors[colorScheme ?? "light"].card}
                      iconColor={Colors[colorScheme ?? "light"].iconColors["alert-circle"]}
                    >
                      {t("removeImage")}
                    </Button>
                  </Card.Content>
                </Card>
              </Animated.View>
            )}

            {image && (
              <Animated.View
                entering={FadeIn.duration(600).springify()}
                exiting={FadeOut.duration(600)}
                style={[animatedButtonStyle, { marginBottom: 10 }]}
              >
                <Button
                  mode="contained"
                  disabled={isRecognizing}
                  loading={isRecognizing}
                  onPress={onRecognize}
                  buttonColor={Colors[colorScheme ?? "light"].tint}
                  textColor="#FFFFFF"
                  style={styles.recognizeButton}
                >
                  {t("recognizeButton")}
                </Button>
              </Animated.View>
            )}

            {image && (
              <Animated.View
                entering={FadeIn.duration(650).springify()}
                exiting={FadeOut.duration(650)}
                style={{ marginBottom: 10 }}
              >
               
              </Animated.View>
            )}
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
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  imageContainer: {
    alignItems: "center",
  },
  imageThumbnail: {
    width: 200,
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
  },
  removeButton: {
    borderWidth: 1,
  },
  recognizeButton: {
    borderRadius: 8,
    paddingVertical: 5,
  },
  shareButton: {
    borderRadius: 8,
    paddingVertical: 5,
    marginTop: 10,
  },
});