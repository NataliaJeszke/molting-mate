import { router, useLocalSearchParams } from "expo-router";

import ModalInfo from "@/components/commons/ModalInfo/ModalInfo";
import WrapperComponent from "@/components/ui/WrapperComponent";

export default function ManageAlertModal() {
    const { id, type } = useLocalSearchParams();
  
    const handleSubmit = (date: string) => {
      if (type === "feeding" && typeof id === "string") {
        console.log("Nakarm pająka z ID:", id, "na datę:", date);
      } else if (type === "molting") {
      }
    };
  
    return (
      <WrapperComponent>
        <ModalInfo
          isVisible={true}
          onClose={() => {
            router.back();
          }}
          onSubmit={handleSubmit}
        />
      </WrapperComponent>
    );
  }
  