import React, { FC, ReactNode } from "react";
import { ThemedView } from "./ThemedView";

type Props = {
  children: ReactNode;
  withHeader: boolean;
};
const Container: FC<Props> = ({ children, withHeader = false }) => {
  return (
    <ThemedView
      style={{
        flex: 1,
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
