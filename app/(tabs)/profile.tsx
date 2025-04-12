import { StyleSheet, Button, Switch } from "react-native";
import { useUserStore } from "@/store/userStore";
import { ThemedText } from "@/components/ui/ThemedText";
import WrapperComponent from "@/components/ui/WrapperComponent";
import { Theme } from "@/constants/Theme.enums";
import CardComponent from "@/components/ui/CardComponent";

export default function ProfileScreen() {
  const { currentTheme, toggleTheme } = useUserStore();
  const defaultTheme = Theme.DARK;
  const toggleHasOnboarded = useUserStore((store) => store.toggleHasOnboarded);

  return (
    <WrapperComponent>
      <CardComponent customStyle={styles.container}>
        <ThemedText type="subtitle">Ustawienia aplikacji</ThemedText>
        <ThemedText style={styles.switchLabel}>Przełącz motyw:</ThemedText>
        <Switch
          value={currentTheme === defaultTheme}
          onValueChange={toggleTheme}
        />
        <ThemedText style={styles.switchLabel}>Powiadomienia:</ThemedText>
        <Switch value={true} onValueChange={() => {}} />
        <Button title="Back to onboarding" onPress={toggleHasOnboarded} />
      </CardComponent>
      <CardComponent customStyle={styles.container}>
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
const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    gap: 16,
    paddingTop: 16,
  },
  switchLabel: {
    fontSize: 16,
  },
});
