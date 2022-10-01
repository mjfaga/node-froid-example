# Demo Repo for `@wayfair/node-froid`

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Generating the Froid schema](#generating-the-froid-schema)
  - [Running the demo](#running-the-demo)
- [Sample Query](#sample-query)
  - [Query](#query)
  - [Variables](#variables)

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
   yarn generate:froid # generates to ./schema.graphql
   ```

### Running the demo

1. Set .apollo-key file with the service key for the graph
1. Start the services:
   ```sh
   yarn start
   ```
1. Navigate to http://localhost:4000/graphql to access the playground

## Sample Query

### Query

```gql
query BooksByGenreCursorConnection($first: Int, $nodeId: ID!) {
  node(id: $nodeId) {
    __typename
    id
    ... on Book {
      title
    }
  }
  booksByGenreCursorConnection(first: $first) {
    edges {
      node {
        id
        title
        author {
          id
          fullName
        }
      }
    }
  }
}
```

### Variables

```json
{
  "first": 2,
  "nodeId": "Qm9vazp7ImJvb2tJZCI6MX0="
}
```
