import AsyncStorage from '@react-native-async-storage/async-storage';


export async function getSpotifyAccessToken() {
  try {

    const response = await fetch('http://192.168.0.11:3001/api/spotify-credentials');
    const data = await response.json();

    if (!response.ok) {
      console.error(`Error getting Spotify credentials: ${data.error}`);
      return null;
    }

    return data.accessToken;
  } catch (error) {
    console.error('Error getting Spotify credentials:', error);
    return null;
  }
}

export async function getTopArtists() {
  try {
    const yourAccessToken = await getSpotifyAccessToken();

    if (!yourAccessToken) {
      console.error('Access token not available.');
      return null;
    }

    const response = await fetch('http://192.168.0.11:3001/api/top-artists-by-genre', {
      headers: {
        Authorization: `Bearer ${yourAccessToken}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(`Error fetching top artists: ${data.error}`);
      return null;
    }


    AsyncStorage.setItem('topArtists', JSON.stringify(data));

    return data;
  } catch (error) {
    console.error('Error fetching top artists:', error);
    return null;
  }
}

export async function getAllArtists() {
  try {
    const yourAccessToken = await getSpotifyAccessToken();

    if (!yourAccessToken) {
      console.error('Access token not available.');
      return null;
    }

    const response = await fetch('http://192.168.0.11:3001/api/top-artists-by-genre', {
      headers: {
        Authorization: `Bearer ${yourAccessToken}`,
      },
    });


    const data = await response.json();

    if (!response.ok) {
      console.error(`Error fetching all artists: ${data.error}`);
      return null;
    }


    AsyncStorage.setItem('allArtists', JSON.stringify(data));

    return data;
  } catch (error) {
    console.error('Error fetching all artists:', error);
    return null;
  }
}


export async function getTestEndpointData() {
  try {
    const response = await fetch('http://192.168.0.11:3001/api/test-endpoint');
    const data = await response.json();

    if (!response.ok) {
      console.error(`Error fetching test endpoint data: ${data.error}`);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error fetching test endpoint data:', error);
    return null;
  }
}
