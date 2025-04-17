import { StyleSheet, Button, Switch } from "react-native";

import { useUserStore } from "@/store/userStore";

import { Theme } from "@/constants/Theme.enums";
import { ThemeType } from "@/constants/Colors";

import { ThemedText } from "@/components/ui/ThemedText";
import WrapperComponent from "@/components/ui/WrapperComponent";
import CardComponent from "@/components/ui/CardComponent";

export default function ProfileScreen() {
  const { currentTheme, toggleTheme } = useUserStore();
  const defaultTheme = Theme.DARK;
  const toggleHasOnboarded = useUserStore((store) => store.toggleHasOnboarded);

  return (
    <WrapperComponent>
      <CardComponent customStyle={styles(currentTheme)["settings"]}>
        <ThemedText type="subtitle">Ustawienia aplikacji</ThemedText>
        <ThemedText style={styles(currentTheme)["settings__switchlabel"]}>
          Przełącz motyw:
        </ThemedText>
        <Switch
          value={currentTheme === defaultTheme}
          onValueChange={toggleTheme}
        />
        <ThemedText style={styles(currentTheme)["settings__switchlabel"]}>
          Powiadomienia:
        </ThemedText>
        <Switch value={true} onValueChange={() => {}} />
        <Button title="Back to onboarding" onPress={toggleHasOnboarded} />
      </CardComponent>
      <CardComponent customStyle={styles(currentTheme)["settings"]}>
        <ThemedText type="subtitle">Ustawienia profilu</ThemedText>
        <ThemedText>Zmień adres mailowy</ThemedText>
        <ThemedText>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum
          molestiae sunt reiciendis assumenda quis quae repellat? Tempora magni
          laborum voluptatem, obcaecati quis consequuntur, molestiae
          perspiciatis libero numquam, illum illo ipsa.
        </ThemedText>
      </CardComponent>
    </WrapperComponent>
  );
}

/* eslint-disable react-native/no-unused-styles */
const styles = (theme: ThemeType) =>
  StyleSheet.create({
    settings: {
      flexDirection: "column",
      gap: 16,
      paddingTop: 16,
    },
    settings__switchlabel: {
      fontSize: 16,
    },
  });
