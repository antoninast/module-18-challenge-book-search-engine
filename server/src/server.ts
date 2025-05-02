import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import { typeDefs, resolvers } from './schemas/index.js';
import db from './config/connection.js';
import { authenticateToken } from './utils/auth-utils.js';

const app = express();
const PORT = parseInt(process.env.PORT || '3001', 10);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const startApolloServer = async () => {
  await server.start();

  app.use(cors({
    origin: 'https://module-18-challenge-book-search-engine-58vq.onrender.com',
    credentials: true
  }));

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.use('/graphql', expressMiddleware(server, {
    context: authenticateToken
  }));

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../../client/dist')));
    app.get('*', (_req, res) =>
      res.sendFile(path.join(__dirname, '../../client/dist/index.html'))
    );
  }

  db.on('error', console.error.bind(console, 'MongoDB connection error:'));

  app.listen(PORT, '0.0.0.0', () =>
    console.log(`🌍 Server running at http://localhost:${PORT}`)
  );
};

startApolloServer();