/**
 * fs and path let us read files from local filesystem
 * neo4j-graphql-js translates GraphQL queries to Cypher queries
 */
import { neo4jgraphql } from "neo4j-graphql-js";
import fs from 'fs';
import path from 'path';

/**
 * Read (and export) the `schema.graphql` file as a String
 */
export const typeDefs = 
  fs.readFileSync(process.env.GRAPHQL_SCHEMA || path.join(__dirname, "schema.graphql"))
    .toString('utf-8');

/**
 * Generate our query and mutation resolvers
 * (using the neo4jgraphql library so we don't have to write them from scratch)
 */
export const resolvers = {
  Query: {
    allResources: neo4jgraphql
  },
  Mutation: {
    AddConceptToConcept(object, params, ctx, resolveInfo) {
      return neo4jgraphql(object, params, ctx, resolveInfo, true);
    },
    // DeleteAll(object, params, ctx, resolveInfo) {
    //   return neo4jgraphql(object, params, ctx, resolveInfo, true);
    // }
  }
};
