require("dotenv").config();
import express from "express";
import logger from "morgan";
import { ApolloServer } from "apollo-server-express";
import { typeDefs, resolvers } from "./schema";
import { getUser, protectResolvers } from "./users/users.utils";

const server = new ApolloServer({
  resolvers,
  typeDefs,
  context: async ({ req }) => {
    return {
      loggedInUser: await getUser(req.headers.token),
      protectResolvers,
    };
  },
});

const PORT = process.env.PORT;

const app = express();
app.use(logger("tiny"));

server.applyMiddleware({ app });

app.listen({ port: PORT }, () => {
  console.log(`🚀 Сервер запущен на http://localhost:${PORT}/`);
});
