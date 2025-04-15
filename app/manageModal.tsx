import { useEffect } from "react";
import { router, useLocalSearchParams } from "expo-router";
import ModalInfo from "@/components/commons/ModalInfo/ModalInfo";
import { View, StyleSheet } from "react-native";
import ModalAlert from "@/components/commons/ModalAlert/ModalAlert";

export default function ManageAlertModal() {
  const params = useLocalSearchParams();
  const { id, type, action } = params;

  useEffect(() => {
    console.log("ManageAlertModal mounted with:", { id, type, action });
  }, [id, type, action]);

  const handleClose = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      {action === "delete" && (
        <ModalAlert
          isVisible={true}
          onClose={handleClose}
        />
      )}
      {action === "edit" && (
        <ModalInfo
          isVisible={true}
          onClose={handleClose}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
});