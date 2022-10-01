/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {globalIdField, fromGlobalId, connectionFromArray} from 'graphql-relay';
import DataLoader from 'dataloader';

// eslint-disable-next-line
const books = require('./books');

const Genre = {
  All: 'ALL',
};

// This strategy simulates aggregate query to a datastore, and
// the constructs the properly formatted result with that result set
//
// similarBookIdsArray comes in the format: [[1,2], [3,4]]
async function batchLoadSimilarBooks(similarBookIdKeys) {
  // =====================================================
  // START SIMULATE DATA STORE QUERY
  // =====================================================
  // Get flat, unique list of similar book ids across all books being resolved
  // Uniqueness typically handled in datasource query
  const bookIdSet = similarBookIdKeys.reduce(
    (agg, similarBookIds) => new Set([...agg, ...similarBookIds]),
    []
  );

  // Load the aggregate similar books dataset
  // Using reduce here to generate constant time lookup map
  // of books
  const loadedBooks = books.filter((book) => bookIdSet.has(book.id));
  // =====================================================
  // END SIMULATE DATA STORE QUERY
  // =====================================================

  const bookCache = {};

  return similarBookIdKeys.map((similarBookIds) =>
    similarBookIds.map(
      (bookId) =>
        bookCache[bookId] ||
        // Hydrate constant time cache and return value
        (bookCache[bookId] = loadedBooks.find((b) => bookId === b.id))
    )
  );
}
const similarBooksBatchLoader = new DataLoader(batchLoadSimilarBooks);

function booksByGenre(genre) {
  if (genre === Genre.All) {
    return books;
  } else {
    return books.filter((book) => book.genre === genre);
  }
}

const resolvePaginatePageNumberBooks = (args) => {
  const filteredBooks = booksByGenre(args.genre);
  const {limit, pageNumber} = args;
  const totalCount = filteredBooks.length;
  const totalPages = limit > totalCount ? 1 : Math.ceil(totalCount / limit);
  const startIndex = (pageNumber - 1) * limit;
  const endIndex = startIndex + limit;
  const slicedBooks = filteredBooks.slice(startIndex, endIndex);

  return {
    limit,
    totalPages,
    totalCount,
    pageNumber,
    ...connectionFromArray(slicedBooks, args),
  };
};

export default {
  Query: {
    booksByGenreCursorConnection: (_, args) => {
      const filteredBooks = booksByGenre(args.genre);

      return {
        ...connectionFromArray(filteredBooks, args),
        totalCount: books.length,
      };
    },
    booksByGenrePageConnection: (_, args) => {
      return resolvePaginatePageNumberBooks(args);
    },
  },
  Book: {
    id: globalIdField(),
    bookId: (book) => book.id,
    similarBooks: (book) => similarBooksBatchLoader.load(book.similarBookIds),
    author: (book) => ({authorId: book.authorId}),
    __resolveReference: (object) => {
      return books.find((book) => book.id === object.bookId);
    },
  },
};
