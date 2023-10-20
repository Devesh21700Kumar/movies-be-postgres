const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Configure the database connection here
const db = require('./db'); // Create this file in the next step

db.testDatabaseConnection()
  .then((connected) => {
    if (connected) {
      // Database is connected, start the server
      console.log("gg")
    } else {
      console.log('Server cannot start because the database is not connected.');
    }
  })
  .catch((error) => {
    console.error('Error testing the database connection:', error);
  });


app.get('/', async (req, res) => {
    try {
        console.log("ggff")
        //console.log(db);
      const movies = await db.db.any('SELECT * FROM mytable');
      console.log(movies)
      res.json(movies);
    } catch (error) {
        console.log(error);
      res.status(500).json({ error: 'An error occurred while fetching movies.' });
    }
  });

  app.get('/movies', async (req, res) => {
    try {
        console.log(req.query)
      const page = parseInt(req.query.page) || 1; // Get the requested page from the query parameters
      console.log(page)
      const itemsPerPage = 10; // Define the number of items per page
  
      const offset = (page - 1) * itemsPerPage; // Calculate the offset
  
      const query = `
        SELECT *
        FROM mytable
        LIMIT ${itemsPerPage}
        OFFSET ${offset}
      `;
  
      let movies ={results:[], totalPage:1000}
      movies['results']= await db.db.any(query);
  
      res.json(movies);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while fetching movies.' });
    }
  });
  

  app.get('/check-table-exists', async (req, res) => {
    try {
      const result = await db.db.oneOrNone(
        "SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'mytable')"
      );
      res.json({ tableExists: result.exists });
    } catch (error) {
        console.log(error);
      res.status(500).json({ error: 'An error occurred while checking the table existence.' });
    }
  });

  app.get('/searchByGenre', async (req, res) => {
    const activeGenre = req.query.searchByGenre;
    const page = parseInt(req.query.page) || 1;
    const itemsPerPage = 10;
  
    const offset = (page - 1) * itemsPerPage;
  
    try {
        const query = `
        SELECT * FROM mytable
        WHERE title ILIKE '%$1#%'
        LIMIT ${itemsPerPage}
        OFFSET ${offset}
      `;
      const movies = { results: [], totalPage: 1000 };
      movies.results = await db.db.any(query, [activeGenre]);
      console.log(movies);
  
      res.status(200).json(movies);
    } catch (error) {
      console.error('Error searching:', error);
      res.status(500).json({ error: 'An error occurred while searching.' });
    }
  });

  app.get('/search', async (req, res) => {
    const keyword = req.query.keyword;
  
    try {
      // Query the database based on the provided keyword
      const query = `
        SELECT * FROM mytable
        WHERE title ILIKE '%$1#%'
      `;
  
      let movies ={results:[], totalPage:1000}
      movies.results = await db.db.any(query, keyword);
  
      res.status(200).json(movies);
    } catch (error) {
      console.error('Error searching:', error);
      res.status(500).json({ error: 'An error occurred while searching.' });
    }
  });

  app.post('/modify-rating', async (req, res) => {
    const id = req.query.id;
    const newRating = req.body.newRating;
  
    try {
      // Ensure you have a table named 'your_table_name'
      const query = `
        UPDATE mytable
        SET rating = $1
        WHERE id = $2
      `;
  
      await db.db.none(query, [newRating, id]);
      res.status(200).json({ message: 'Rating modified successfully.' });
    } catch (error) {
      console.error('Error modifying rating:', error);
      res.status(500).json({ error: 'An error occurred while modifying the rating.' });
    }
  });

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
