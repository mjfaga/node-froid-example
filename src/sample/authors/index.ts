import {ApolloServer} from 'apollo-server';
import {buildSubgraphSchema} from '@apollo/subgraph';
import {parse} from 'graphql';
import resolvers from './resolvers';
import fs from 'fs';

const schema = fs
  .readFileSync('./src/sample/authors/schema.graphql', 'utf8')
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

server.listen({port: 5002}).then(({url}) => {
  console.log(`🚀 Authors service ready at ${url}`);
});
