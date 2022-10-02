/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import {ApolloServer} from 'apollo-server-express';
import {ApolloGateway, RemoteGraphQLDataSource} from '@apollo/gateway';
import {serializeQueryPlan} from '@apollo/query-planner';

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

export const _devGatewayDidResolveQueryPlan = (options: {
  [key: string]: any;
}): void => {
  if (options.requestContext.operationName !== 'IntrospectionQuery') {
    console.log('========================================');
    console.log(options.requestContext.request.query);
    console.log('========================================');
    console.log(serializeQueryPlan(options.queryPlan));
  }
};

class VariantNotificationDataSource extends RemoteGraphQLDataSource {
  willSendRequest({request}) {
    request.http.headers.set('supergraph-variant', graphVariant);
  }
}

(async function () {
  const app = express();

  const gateway = new ApolloGateway({
    experimental_didResolveQueryPlan: _devGatewayDidResolveQueryPlan,
    buildService({url}) {
      return new VariantNotificationDataSource({url});
    },
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
