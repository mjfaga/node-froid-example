/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {globalIdField, connectionFromArray} from 'graphql-relay';
import DataLoader from 'dataloader';

// eslint-disable-next-line
const reviews = require('./data');

async function batchLoadReviews(reviewIds) {
  // Load up a dictionary of data we need to resolve the request
  const reviewMap = reviews
    .filter((review) => reviewIds.includes(review.id))
    .reduce((agg, review) => {
      agg[review.id] = review;
      return agg;
    }, {});

  // Generate an ordered response based on the incoming keys provided
  return reviewIds.map((reviewId) => reviewMap[reviewId]);
}
const ReviewBatchLoader = new DataLoader(batchLoadReviews);

function reviewsByRating(listingReviews, rating) {
  if (!rating) {
    return listingReviews;
  } else {
    return listingReviews.filter((review) => review.rating === rating);
  }
}

export default {
  MarketplaceListing: {
    reviews: (listing, args) => {
      const listingReviews = reviews.filter(
        (review) => listing.listingId === review.listingId
      );

      const filteredReviews = reviewsByRating(listingReviews, args.rating);

      return {
        ...connectionFromArray(filteredReviews, args),
        totalCount: listingReviews.length,
      };
    },
  },
  MarketplaceListingReview: {
    id: globalIdField(),
    reviewId: (review) => review.id,
    __resolveReference: (obj) => {
      return ReviewBatchLoader.load(obj.reviewId);
    },
  },
};
