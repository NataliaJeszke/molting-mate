import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    View,
  } from "react-native";
  import SpiderList from "@/components/commons/SpiderList/SpiderList";
  
  export default function Feeding() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <ScrollView>
            <SpiderList title="🍽️ Pająki przed karmieniem" />
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
  });