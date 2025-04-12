import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";

import SpiderFullList from "@/components/commons/SpiderFullList/SpiderFullList";
import WrapperComponent from "@/components/ui/WrapperComponent";
const favouriteSpiders = [
  { id: "1", name: "Pająk 1", date: "2024-03-30", status: "Nie nakarmiony" },
  { id: "2", name: "Pająk 2", date: "2024-03-28", status: "Nie nakarmiony" },
  { id: "3", name: "Pająk 1", date: "2024-03-30", status: "Nie nakarmiony" },
  { id: "4", name: "Pająk 2", date: "2024-03-28", status: "Nie nakarmiony" },
  { id: "5", name: "Pająk 1", date: "2024-03-30", status: "Nie nakarmiony" },
  { id: "6", name: "Pająk 2", date: "2024-03-28", status: "Nie nakarmiony" },
];

export default function Favourites() {
  return (
    <WrapperComponent>
        <ScrollView>
          <SpiderFullList data={favouriteSpiders} info="Ulubione pająki" />
        </ScrollView>
    </WrapperComponent>
  );
}
