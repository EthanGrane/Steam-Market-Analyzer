import { useEffect, useState } from 'react';
import SteamApi from '../services/SteamServices';

export default function useSteamSearch(gamesHistory) {
    const [searchArgument, setSearchArgument] = useState('');
    const [searchItems, setSearchItems] = useState([]);
    const [gameDetails, setGameDetails] = useState({});

    useEffect(() => {
        const fetchHistory = async () => {
            const detailsMap = {};

            await Promise.all(
                gamesHistory.map(async (appid) => {
                    const details = await SteamApi.getGameDetails(appid);
                    detailsMap[appid] = details;
                })
            );

            setGameDetails(detailsMap);
        };

        fetchHistory();
    }, []);

    useEffect(() => {
        if (!searchArgument.trim()) {
            setSearchItems([]);
            return; 
        }

        const timeout = setTimeout(async () => {
            const items = await SteamApi.searchGames(searchArgument);
            setSearchItems(items);
        }, 1000);

        return () => clearTimeout(timeout);
    }, [searchArgument]);

    useEffect(() => {
        if (searchItems.length === 0) return;

        const fetchDetails = async () => {
            const newDetails = {};

            await Promise.all(
                searchItems.map(async (item) => {
                    const details = await SteamApi.getGameDetails(item.id);
                    newDetails[item.id] = details;
                })
            );

            setGameDetails(prev => ({
                ...prev,
                ...newDetails
            }));
        };

        fetchDetails();
    }, [searchItems]);

    return {
        searchArgument,
        setSearchArgument,
        searchItems,
        gameDetails,
        setGameDetails
    };
}