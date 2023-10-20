const fs = require('fs'); // Add the 'fs' module to work with the file system
const axios = require('axios');
const API_KEY = 'fe566ec66fc817f41b843db221b0555a';
const BASE_URL = 'https://api.themoviedb.org/3';

async function fetchMovies(page) {
  try {
    const response = await axios.get(`${BASE_URL}/movie/popular`, {
      params: {
        api_key: API_KEY,
        page: page, // You'll need to implement pagination
      },
    });

    const movies = response.data.results;
    return movies;
  } catch (error) {
    console.error('Error fetching movies:', error);
    return [];
  }
}

async function fetchManyMovies(totalMovies) {
  const moviesPerPage = 20; // Number of movies per page
  const numPages = Math.ceil(totalMovies / moviesPerPage);
  let allMovies = [];

  for (let page = 1; page <= numPages; page++) {
    const movies = await fetchMovies(page);
    allMovies = allMovies.concat(movies);
  }

  return allMovies.slice(0, totalMovies);
}

// Call the function to fetch 10,000 movies
fetchManyMovies(10000)
  .then((movies) => {
    // Save the fetched movies to a JSON file
    const jsonMovies = JSON.stringify(movies, null, 2);
    fs.writeFileSync('movies.json', jsonMovies);

    console.log('Fetched movies and saved to movies.json');
  })
  .catch((error) => {
    console.error('Error fetching movies:', error);
  });
