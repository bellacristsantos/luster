import AsyncStorage from '@react-native-async-storage/async-storage';

 export const getData = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      return value;
    }
    return null;
  } catch (error) {
    console.error('Erro ao obter dados do AsyncStorage:', error);
    return null;
  }
};

export const storeData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.error('Erro ao salvar dados no AsyncStorage:', error);
  }
};

export const clearAllItems = async () => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.error('Erro ao limpar o AsyncStorage:', error);
  }
};

