import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

import { useUserStore } from '@/store/userStore';
import { Colors } from '@/constants/Colors';

const SearchComponent = () => {
  const [searchText, setSearchText] = useState('');
  const { currentTheme } = useUserStore();
  
  const isDarkMode = currentTheme === 'dark';
  const searchBarColors = isDarkMode ? Colors.dark.searchBar : Colors.light.searchBar;

  const handleSearch = (text: string) => {
    setSearchText(text);
    console.log('Wpisano:', text);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.input, searchBarColors]}
        placeholder="Szukaj pająka..."
        placeholderTextColor="#888"
        value={searchText}
        onChangeText={handleSearch}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
});

export default SearchComponent;
