import express from 'express';
import { ApolloServer } from '@apollo/server';
import path from 'node:path';
import { typeDefs, resolvers } from './schemas/index.js';
import db from './config/connection.js';
// import routes from './routes/index.js';
import { expressMiddleware } from '@apollo/server/express4';
import { authenticateToken } from './utils/auth-utils.js';

const app = express();
const PORT = process.env.PORT || 3001;

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const startApolloServer = async () => {
  await server.start();

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  const graphqlMiddleware = await expressMiddleware(server, {
    context: authenticateToken
  });
  app.use('/graphql', graphqlMiddleware);

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../../client/dist')));
    // app.use(express.static(path.join(__dirname, '../client/build')));

    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
    })
  }

  db.on('error', console.error.bind(console, 'MongoDB connection error:'));

  app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
};

startApolloServer();
