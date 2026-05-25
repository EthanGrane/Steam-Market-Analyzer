import { Pressable, TextInput, View } from 'react-native';

import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { globalStyles } from './assets/styles/Styles';
import Navigation from './components/view/Navigation';
import GameList from './components/view/GameList';
import { SearchIcon } from './components/view/Icons';
import useSteamSearch from './hooks/useSteamSearch';
import SearchBar from './components/view/SearchBar';

import { AuthProvider } from './context/authContext';


export default function App() {

  const {
    searchArgument,
    setSearchArgument,
    searchItems,
    gameDetails,
    setGameDetails
  } = useSteamSearch();

  return (
    <AuthProvider>
      <SafeAreaProvider style={globalStyles.container}>
        <Navigation />

        <View style={globalStyles.content}>

          <SearchBar value={searchArgument} onChangeText={setSearchArgument} />

          <GameList
            searchItems={searchItems}
            gameDetails={gameDetails}
            setGameDetails={setGameDetails}
          />

        </View>

        <StatusBar style="dark" />
      </SafeAreaProvider >
    </AuthProvider>
  );
}