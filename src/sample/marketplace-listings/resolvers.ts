/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {globalIdField} from 'graphql-relay';
import DataLoader from 'dataloader';

// eslint-disable-next-line
const listings = require('./data');

// This strategy simulates aggregate query to a datastore, and
// the constructs the properly formatted result with that result set
//
// similarListingIds array comes in the format: [[1,2], [3,4]]
async function batchLoadSimilarListings(similarListingIds) {
  // =====================================================
  // START SIMULATE DATA STORE QUERY
  // =====================================================
  // Get flat, unique list of similar listing ids across all listings being resolved
  // Uniqueness typically handled in datasource query
  const listingSet = similarListingIds.reduce(
    (agg, similarBookIds) => new Set([...agg, ...similarBookIds]),
    []
  );

  // Load the aggregate similar listings dataset
  // Using reduce here to generate constant time lookup map
  // of books
  const loadedListings = listings.filter((listing) =>
    listingSet.has(listing.id)
  );
  // =====================================================
  // END SIMULATE DATA STORE QUERY
  // =====================================================

  const dataCache = {};

  return similarListingIds.map((listingIds) =>
    listingIds.map(
      (listingId) =>
        dataCache[listingId] ||
        // Hydrate constant time cache and return value
        (dataCache[listingId] = loadedListings.find((l) => listingId === l.id))
    )
  );
}
const similarListingsBatchLoader = new DataLoader(batchLoadSimilarListings);

async function batchLoadListings(listingIds) {
  // Load up a dictionary of data we need to resolve the request
  const listingMap = listings
    .filter((listing) => listingIds.includes(listing.id))
    .reduce((agg, listing) => {
      agg[listing.id] = listing;
      return agg;
    }, {});

  // Generate an ordered response based on the incoming keys provided
  return listingIds.map((listingId) => listingMap[listingId]);
}
const ListingBatchLoader = new DataLoader(batchLoadListings);

export default {
  Query: {
    marketplaceListing: (_, args) =>
      listings.find((listing) => listing.id === args?.listingId?.toUpperCase()),
  },
  MarketplaceListing: {
    id: globalIdField(),
    listingId: (listing) => listing.id,
    similarListings: (listing) =>
      similarListingsBatchLoader.load(listing.similarListingIds),
    __resolveReference: (obj) => {
      return ListingBatchLoader.load(obj.listingId);
    },
  },
};
