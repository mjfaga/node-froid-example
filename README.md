# Demo Repo for `@wayfair/node-froid`

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Generating the Froid schema](#generating-the-froid-schema)
  - [Setting up your Managed Federation Graph](#setting-up-your-managed-federation-graph)
  - [Running the demo](#running-the-demo)
- [Sample Queries](#sample-queries)
  - [Reviews Connection Query](#reviews-connection-query)
    - [Variables](#variables)
  - [`node` Query](#node-query)
    - [Variables](#variables-1)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Getting Started

### Installation

1. Install dependencies:
   ```sh
   yarn install
   ```

### Generating the Froid schema

1. Trigger the generate command
   ```sh
   yarn generate:froid # generates to ./src/sample/froid/schema.graphql
   ```

_NOTE: For convenience, this is already completed if you use the `main` branch
of this repo_

### Setting up your Managed Federation Graph

1. Set up a new Graph in with a **Graph Architecture** = `Supergraph` (the
   default)
1. Run the rover scripts below to push all subgraph schemas in this demo to your
   supergraph

```sh
rover subgraph publish <your-graph-id>@source --schema ./src/sample/marketplace-listings/schema.graphql --name marketplace-listing-service --routing-url http://localhost:5001/graphql
rover subgraph publish <your-graph-id>@source --schema ./src/sample/reviews/schema.graphql --name reviews-service --routing-url http://localhost:5002/graphql
rover subgraph publish <your-graph-id>@source --schema ./src/sample/froid/schema.graphql --name froid-service --routing-url http://localhost:5000/graphql
```

### Running the demo

1. Copy the `.env.example`
   ```sh
   cp .env.example .env
   ```
1. Update the `.env` with:
   - `APOLLO_KEY`: The service key value from Apollo Studio
   - `GRAPH_ID`: The id of the federated graph you set up in Apollo Studio
   - `GRAPH_VARIANT`: The name of the variant you want to run based on your
     Apollo Studio configuration
1. Start all of the services:
   ```sh
   yarn start
   ```
1. Navigate to http://localhost:4000/graphql to access the gateway playground

## Sample Queries

### Reviews Connection Query

```gql
query MarketplaceListingReviews(
  $first: Int
  $after: String
  $listingId: String!
) {
  marketplaceListing(listingId: $listingId) {
    id
    name
    reviews(first: $first, after: $after) {
      totalCount
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        cursor
        node {
          id
          title
          rating
        }
      }
    }
  }
}
```

#### Variables

```json
{
  "first": 2,
  "after": null,
  "listingId": "W003547033"
}
```

### `node` Query

```gql
query SimilarMarketplaceListings($nodeId: ID!) {
  node(id: $nodeId) {
    __typename
    id
    ... on MarketplaceListing {
      name
      similarListings {
        id
        name
      }
    }
  }
}
```

#### Variables

```json
{
  "nodeId": "TWFya2V0cGxhY2VMaXN0aW5nOnsibGlzdGluZ0lkIjoiVzAwMzU0NzAzMyJ9"
}
```
