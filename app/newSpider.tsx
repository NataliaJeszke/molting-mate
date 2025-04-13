import { ScrollView } from "react-native";
import WrapperComponent from "@/components/ui/WrapperComponent";
import NewSpiderForm from "@/core/NewSpiderForm/NewSpiderForm";

export default function NewSpiderScreen() {
  return (
    <WrapperComponent>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        <NewSpiderForm />
      </ScrollView>
    </WrapperComponent>
  );
}
