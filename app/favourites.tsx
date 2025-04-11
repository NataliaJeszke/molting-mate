import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    View,
  } from "react-native";
  import SpiderList from "@/components/commons/SpiderList/SpiderList";
  
  export default function Favourites() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <ScrollView>
            <SpiderList title="Ulubione pająki" />
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
    },
  
    button: {
      backgroundColor: "#1a759f",
      padding: 10,
      borderRadius: 5,
      marginBottom: 8,
    },
  
    buttonText: {
      color: "#fff",
      fontSize: 16,
      textAlign: "center",
    },
  
    searchInput: {
      backgroundColor: "#f1f1f1",
      padding: 10,
      margin: 16,
      borderRadius: 8,
      fontSize: 16,
      borderColor: "#ccc",
      borderWidth: 1,
    },
  });