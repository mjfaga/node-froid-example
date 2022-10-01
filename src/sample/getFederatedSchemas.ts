import fs from 'fs';

export function getFederatedSchemas(): Map<string, string> {
  const map = new Map();

  map.set(
    'book-service',
    fs.readFileSync('./src/sample/books/schema.graphql').toString()
  );

  map.set(
    'author-service',
    fs.readFileSync('./src/sample/authors/schema.graphql').toString()
  );

  return map;
}
