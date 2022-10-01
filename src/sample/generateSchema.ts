import fs from 'fs';
import {print} from 'graphql';
import {generateFroidSchema, FederationVersion} from '@wayfair/node-froid';
// You have to provide this. Apollo's public API should provide the ability to extract out subgraph SDL
import {getFederatedSchemas} from './getFederatedSchemas';

const froidSubgraphName = 'froid-service';

// Map<string, string> where the key is the subgraph name, and the value is the SDL schema
const subgraphSchemaMap = getFederatedSchemas();

const schemaAst = generateFroidSchema(subgraphSchemaMap, froidSubgraphName, {
  federationVersion: FederationVersion.V2,
  contractTags: ['public'],
});

// persist results to a file to use with rover publish
fs.writeFileSync('./src/sample/froid/schema.graphql', print(schemaAst));
