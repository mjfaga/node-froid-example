import {ApolloServer} from 'apollo-server';
import {buildSubgraphSchema} from '@apollo/subgraph';
import {parse} from 'graphql';
import resolvers from './resolvers';
import fs from 'fs';

const schema = fs
  .readFileSync('./src/sample/marketplace-listings/schema.graphql', 'utf8')
  .toString();
const typeDefs = parse(schema);

const server = new ApolloServer({
  schema: buildSubgraphSchema([
    {
      typeDefs,
      // @ts-ignore
      resolvers,
    },
  ]),
});

server.listen({port: 5001}).then(({url}) => {
  console.log(`🚀 Marketplace Listings service ready at ${url}`);
});
