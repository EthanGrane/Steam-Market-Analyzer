const SteamApi = {

    searchGames: async (appid) => {
        const url = `https://store.steampowered.com/api/storesearch/?term=${appid}&cc=us&l=en`;
        const res = await fetch(url);
        const data = await res.json();

        const items = (data.items || [])
            .filter((item) => item.type === "app")
            .map((item) => ({
                id: item.id,
                name: item.name,
                image: item.tiny_image,
                price: item.price?.final ?? null,
            }));

        return items.slice(0, 20);
    },

    getGameDetails: async (appid) => {
        const reviewURL = `https://store.steampowered.com/appreviews/${appid}?json=1&language=all&num_per_page=0`;
        const reviewRes = await fetch(reviewURL);
        const reviewData = await reviewRes.json();

        const detailsURL = `https://store.steampowered.com/api/appdetails?appids=${appid}&cc=us&l=en`;
        const detailsRes = await fetch(detailsURL);
        const detailsData = await detailsRes.json();

        const spyURL = `https://steamspy.com/api.php?request=appdetails&appid=${appid}`;
        const spyRes = await fetch(spyURL);
        const spyData = await spyRes.json();

        // 👈 añade esta llamada
        const currentRes = await fetch(
            `https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=${appid}`
        );
        const currentData = await currentRes.json();

        const tags = Object.entries(spyData.tags || {})
            .sort((a, b) => b[1] - a[1])
            .map(([name]) => name);

        const details = detailsData[appid]?.data || {};

        return {
            reviewData: reviewData.query_summary,
            detailsData: {
                ...details,
                tags,
                current_players: currentData.response?.player_count ?? 0,
                peak_ccu: spyData.ccu ?? 0,
                owners: spyData.owners ?? null,
                avg_hours_total: spyData.average_forever ?? 0,
                avg_hours_2weeks: spyData.average_2weeks ?? 0,
            }
        };
    },

    getGameIcon: (appid) => {
        return `https://cdn.akamai.steamstatic.com/steam/apps/${appid}/logo.png`;
    },

    getGameHeader: (appid) => {
        return `https://cdn.akamai.steamstatic.com/steam/apps/${appid}/header.jpg`;
    },
};

export default SteamApi;