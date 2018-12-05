import { neo4jgraphql } from "neo4j-graphql-js";
import fs from 'fs';
import path from 'path';

export const typeDefs = 
  fs.readFileSync(process.env.GRAPHQL_SCHEMA || path.join(__dirname, "schema.graphql"))
    .toString('utf-8');

export const resolvers = {
  Query: {
    // usersBySubstring: neo4jgraphql,
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
