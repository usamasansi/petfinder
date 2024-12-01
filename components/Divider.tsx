import React from "react";
import { StyleSheet, View } from "react-native";
import { Divider as ReactNativePaperDivider } from "react-native-paper";

const Divider = () => {
  return (
    <View style={styles.divider}>
      <ReactNativePaperDivider />
    </View>
  );
};

const styles = StyleSheet.create({
  divider: {
    paddingTop: 20,
    paddingBottom: 20,
  },
});

export default Divider;
