import fs from 'fs';

export function getFederatedSchemas(): Map<string, string> {
  const map = new Map();

  map.set(
    'marketplace-listing-service',
    fs
      .readFileSync('./src/sample/marketplace-listings/schema.graphql')
      .toString()
  );

  map.set(
    'reviews-service',
    fs.readFileSync('./src/sample/reviews/schema.graphql').toString()
  );

  return map;
}
