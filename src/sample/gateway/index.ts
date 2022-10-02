/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import {ApolloServer} from 'apollo-server-express';
import {ApolloGateway} from '@apollo/gateway';
import {serializeQueryPlan} from '@apollo/query-planner';

export const _devGatewayDidResolveQueryPlan = (options: {
  [key: string]: any;
}): void => {
  if (options.requestContext.operationName !== 'IntrospectionQuery') {
    console.log('========================================');
    console.log(options.requestContext.query);
    console.log('========================================');
    console.log(serializeQueryPlan(options.queryPlan));
  }
};

const {
  APOLLO_KEY: key,
  GRAPH_VARIANT: graphVariant,
  GRAPH_ID: graphId,
} = process.env;

if (!key || !graphVariant || !graphId) {
  console.error(
    'Make sure you copied the .env.example and updated the values based on the graph you set up in Apollo Studio!'
  );
}

(async function () {
  const app = express();

  const gateway = new ApolloGateway({
    experimental_didResolveQueryPlan: _devGatewayDidResolveQueryPlan,
  });

  const server = new ApolloServer({
    gateway,
    apollo: {
      key,
      graphVariant,
      graphId,
    },
  });

  await server.start();

  server.applyMiddleware({
    app,
  });

  app.listen({port: 4000}, () => {
    console.log(
      `🚀 Local Development federation gateway ready and running: http://localhost:4000/graphql`
    );
  });
})();
