/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {globalIdField, fromGlobalId} from 'graphql-relay';
import DataLoader from 'dataloader';

// eslint-disable-next-line
const authors = require('./authors');

async function batchLoadAuthors(authorIds) {
  // Load up a dictionary of authors we need to resolve the request
  const authorMap = authors
    .filter((author) => authorIds.includes(author.id))
    .reduce((agg, author) => {
      agg[author.id] = author;
      return agg;
    }, {});

  // Generate an ordered response based on the incoming keys provided
  return authorIds.map((authorId) => authorMap[authorId]);
}
const authorBatchLoader = new DataLoader(batchLoadAuthors);

export default {
  Author: {
    id: globalIdField(),
    authorId: (parent) => parent.id,
    fullName: (parent) => {
      let fullName = parent.firstName;
      if (parent.lastName) {
        fullName = fullName
          ? `${fullName} ${parent.lastName}`
          : parent.lastName;
      }
      return fullName;
    },
    __resolveReference: (object) => {
      let id;
      if (object.id) {
        const {id: extractedId} = fromGlobalId(object.id);
        id = extractedId;
      } else {
        id = object.authorId;
      }

      return authorBatchLoader.load(parseInt(id, 10));
    },
  },
};
