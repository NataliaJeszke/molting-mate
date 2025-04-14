import { useEffect } from "react";
import { router, useLocalSearchParams } from "expo-router";
import ModalInfo from "@/components/commons/ModalInfo/ModalInfo";
import { Alert, View, StyleSheet } from "react-native";

export enum ViewTypes {
  VIEW_FEEDING = "feeding",
  VIEW_MOLTING = "molting"
}

export default function ManageAlertModal() {
  const params = useLocalSearchParams();
  const { id, type } = params;

  useEffect(() => {
    console.log("ManageAlertModal mounted with:", { id, type });
  }, [id, type]);

  const handleSubmit = (date: string, actionType: string) => {
    console.log(`Zapisywanie danych: ID=${id}, Typ=${actionType}, Data=${date}`);
    
    if (actionType === ViewTypes.VIEW_FEEDING) {
      console.log("Zapisano datę karmienia");
    } else if (actionType === ViewTypes.VIEW_MOLTING) {
      console.log("Zapisano datę linienia");
    }
    
    Alert.alert("Sukces", "Dane zostały zapisane");
    
    router.back();
  };

  return (
    <View style={styles.container}>
      <ModalInfo
        isVisible={true}
        onClose={() => {
          router.back();
        }}
        onSubmit={handleSubmit}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});