import React, { ReactNode } from 'react';
import { SafeAreaView, View, StyleSheet } from 'react-native';

type WrapperComponentProps = {
  children: ReactNode;
};

const WrapperComponent = ({ children }: WrapperComponentProps) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {children}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
  },
});

export default WrapperComponent;
