import { router, useSegments } from "expo-router";
import { useEffect } from "react";
import { useIsNavigationReady } from "./useIsNavigationReady";

export function useCheckAuthentication(authenticated: boolean | null) {
  console.log("🚀 ~ useProtectedRoute ~ authenticated:", authenticated);
  const segments = useSegments();
  const isNavigationReady = useIsNavigationReady();

  useEffect(() => {
    if (!isNavigationReady) return;

    const inAuthGroup = segments[0] === "(auth)";

    console.log(inAuthGroup);

    if (!authenticated && inAuthGroup) {
      router.replace("/login");
    } else if (authenticated && !inAuthGroup) {
      router.replace("/(auth)/(tabs)/");
    }
  }, [authenticated, segments, isNavigationReady]);
}
