import { View } from "react-native";
import React, { FC, ReactNode } from "react";
import { useAppTheme } from "@/lib/theme/Material3ThemeProvider";
import { ThemedView } from "./ThemedView";

type Props = {
  children: ReactNode;
  withHeader: boolean;
};
const Container: FC<Props> = ({ children, withHeader = false }) => {
  const theme = useAppTheme();
  console.log("🚀 ~ container:", theme.colors.background);

  return (
    <ThemedView
      style={{
        flex: 1,
        // backgroundColor: theme.colors.background,
        paddingTop: withHeader ? 18 : 98,
        paddingLeft: 18,
        paddingRight: 18,
      }}
    >
      {children}
    </ThemedView>
  );
};

export default Container;
