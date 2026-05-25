import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import GameCard from './GameCard';
import { globalStyles } from '../../assets/styles/Styles';
import { useEffect } from 'react';
import SteamApi from '../../services/SteamServices';

export default function GameList({ searchItems, gameDetails, setGameDetails }) {
  const gamesHistory = [2379780, 632360, 312520, 3527290, 3293010, 2856370, 1569580, 2753900, 3405340, 2350790];
  const showSearch = searchItems.length > 0;
  const items = showSearch ? searchItems : gamesHistory;

  useEffect(() => {
    const loadHistoryDetails = async () => {
      if (searchItems.length > 0) return;

      const missing = gamesHistory.filter(id => !gameDetails[id]);
      if (missing.length === 0) return;

      try {
        const results = await Promise.all(
          missing.map(id => SteamApi.getGameDetails(id))
        );

        const newDetails = {};
        missing.forEach((id, i) => {
          newDetails[id] = results[i];
        });

        setGameDetails(prev => ({ ...prev, ...newDetails }));
      } catch (err) {
        console.error("Error cargando historial:", err);
      }
    };

    loadHistoryDetails();
  }, [gamesHistory, searchItems]);

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 200 }}>

      <View style={{ marginBottom: 8 }}>
        <Text style={globalStyles.title}>
          {showSearch ? "Search Results:" : "Popular Viewed Games:"}
        </Text>
      </View>

      {items.length > 0 ? (
        items.map((item) => {
          const id = showSearch ? item.id : item;
          const details = gameDetails[id];

          if (!details) {
            return (
              <View key={id} style={globalStyles.card}>
                <ActivityIndicator style={{ margin: 'auto' }} />
              </View>
            );
          }

          return (
            <GameCard
              key={id}
              title={showSearch ? item.name : details.detailsData?.name}
              image={details.detailsData?.header_image}
              reviewData={details.reviewData}
              details={details}      // ← nuevo: pasa el objeto completo al modal
            />
          );
        })
      ) : (
        <View style={{ marginTop: 50, alignItems: 'center' }}>
          <Text style={globalStyles.text}>
            Search for a game to see its stats.
          </Text>
        </View>
      )}

    </ScrollView>
  );
}
