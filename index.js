require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const app = express();

const userRoutes = require('./routes/userRoutes');
const port = process.env.PORT || 3000;

// Middlewares

//app.use(cors());
/* configurer cors pour autoriser seulement certains domaines en production.
app.use(cors({ origin: 'https://ton-domaine.com' }));
restreindre à l’URL de ton front-end pendant le dev :
app.use(cors({ origin: 'http://localhost:5173' })); */

app.use(cors({ origin: 'http://localhost:5173' }));

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({ info: 'Node.js, Express, and Postgres API - Starter Template' });
});
app.use('/api/v1/users', userRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Lancement du serveur
app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});