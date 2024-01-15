const { Router } = require('express');
const fetch = require('node-fetch');
const { clientId, clientSecret, redirectUri } = require('../secret');



const router = Router();

let cachedToken;

router.get('/api/spotify-credentials', async (req, res, next) => {
  try {
    const spotifyCredentials = { clientId, clientSecret, redirectUri };

    if (!cachedToken || cachedToken.expiresAt < Date.now()) {
      const body = await getToken(clientId, clientSecret);
      cachedToken = {
        accessToken: body.access_token,
        expiresAt: Date.now() + body.expires_in * 1000,
      };
    }

    res.status(200).json({ accessToken: cachedToken.accessToken });
  } catch (error) {
    console.error('Error getting Spotify credentials:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/api/top-artists-by-genre', async (req, res) => {
  try {
    const genres = ['pop', 'rock', 'metal', 'reggae', 'indie', 'folk', 'soul', 'jazz', 'blues'];
    const token = cachedToken.accessToken;

    if (!token) {
      console.error('Access token not available.');
      res.status(500).json({ error: 'Access token not available.' });
      return;
    }


    const genrePromises = genres.map(async (genre) => {
      try {
        const response = await fetch(`https://api.spotify.com/v1/search?q=${genre}&type=artist&limit=10&sort=popularity`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });


        const data = await response.json();

        if (!response.ok) {
          console.error(`Error fetching top artists for ${genre}: ${data.error}`);
          return [];
        }


        const topArtists = data.artists && data.artists.items
          ? data.artists.items
          : [];

        return topArtists;
      } catch (error) {
        console.error(`Error fetching top artists for ${genre}:`, error);
        return [];
      }
    });

    const results = await Promise.all(genrePromises);

    const allTopArtists = results.reduce((accumulator, current) => accumulator.concat(current), []);


    const filteredTopArtists = allTopArtists
      .filter((artist) => !!artist.name)
      .filter((artist) => !isGenre(artist.name.toLowerCase()))
      .sort(() => Math.random() - 0.5)
      .map((artist) => ({
        name: capitalizeFirstLetter(artist.name),
        image: artist.images && artist.images.length > 0
          ? artist.images[0].url
          : null,
      }));

    res.json(filteredTopArtists);
  } catch (error) {
    console.error('Error fetching top artists:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.get('/api/test-endpoint', (req, res) => {
  const testData = {
    message: 'Hello from the backend!',
    timestamp: Date.now(),
  };


  res.status(200).json(testData);
});

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function isGenre(artistName) {
  const genres = ['pop', 'rock', 'metal', 'reggae', 'indie', 'folk', 'soul', 'jazz', 'blues'];
  return genres.some((genre) => artistName.includes(genre));
}

async function getArtistData(artistId, token) {
  const response = await fetch(`https://api.spotify.com/v1/artists/${artistId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  return await response.json();
}

async function getToken(clientId, clientSecret) {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    body: new URLSearchParams({
      'grant_type': 'client_credentials',
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + (Buffer.from(`${clientId}:${clientSecret}`).toString('base64')),
    },
  });

  return await response.json();
}

module.exports = router;


