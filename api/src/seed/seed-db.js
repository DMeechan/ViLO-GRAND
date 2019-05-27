import ApolloClient from 'apollo-client';
import gql from 'graphql-tag';
import dotenv from 'dotenv';
import seedmutations from './seed-mutations';
import fetch from 'node-fetch';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

// Import environment variables
dotenv.config();
const { GRAPHQL_CONTAINER_URI } = process.env;
console.log('🗽 Connecting to Apollo Server at:', GRAPHQL_CONTAINER_URI);

/**
 * Connect to a running Apollo server
 */

const client = new ApolloClient({
  link: new HttpLink({ uri: GRAPHQL_CONTAINER_URI, fetch }),
  cache: new InMemoryCache(),
});

/**
 * Attempt to perform our 'seed data' mutations on connected Apollo server
 */
client
  .mutate({
    mutation: gql(seedmutations),
  })
  .then(data => console.log(data))
  .catch(error => console.error('Error inserting seed data:', error));
