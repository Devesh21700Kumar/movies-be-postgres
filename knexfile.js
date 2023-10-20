module.exports = {
    development: {
      client: 'postgresql', // Specify the type of database you are using (e.g., PostgreSQL)
      connection: {
        host: '127.0.0.1', // Your database host
        user: 'your_database_user',
        password: 'your_database_password',
        database: 'your_database_name',
      },
      migrations: {
        directory: './db/migrations', // The directory for migration files
      },
      seeds: {
        directory: './db/seeds', // The directory for seed files
      },
    },
  };
  