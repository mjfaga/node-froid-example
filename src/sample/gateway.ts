/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import express from 'express';
import {ApolloServer} from 'apollo-server-express';
import {ApolloGateway} from '@apollo/gateway';
import {serializeQueryPlan} from '@apollo/query-planner';

export const _devGatewayDidResolveQueryPlan = (options: {
  [key: string]: any;
}): void => {
  if (options.requestContext.operationName !== 'IntrospectionQuery') {
    console.log(serializeQueryPlan(options.queryPlan));
  }
};

(async function () {
  const app = express();

  const gateway = new ApolloGateway({
    experimental_didResolveQueryPlan: _devGatewayDidResolveQueryPlan,
  });

  const server = new ApolloServer({
    gateway,
    apollo: {
      key: process.env.APOLLO_KEY,
      graphVariant: 'fed2-contract',
      graphId: 'marks-graph-6f4pcm',
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
