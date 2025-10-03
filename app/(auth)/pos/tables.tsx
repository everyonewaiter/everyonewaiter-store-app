import { StyleSheet, Text, View } from "react-native";

import { useAuthentication } from "@/providers/AuthenticationProvider";

const PosTableScreen = () => {
  const { device } = useAuthentication();

  if (!device) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text>POS 모바일 기능은 준비중 입니다.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
});

export default PosTableScreen;
