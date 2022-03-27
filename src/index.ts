import { ApolloServer } from 'apollo-server';
import { Prisma, PrismaClient } from '@prisma/client';
import { Mutation } from './resolvers';
import Query from './resolvers/Query';
import typeDefs from './schema';

const prisma = new PrismaClient();

export interface Context {
  prisma: PrismaClient<
    Prisma.PrismaClientOptions,
    never,
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
  >;
}

const server = new ApolloServer({
  typeDefs,
  resolvers: {
    Mutation,
    Query,
  },
  context: {
    prisma,
  },
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
