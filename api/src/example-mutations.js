/**
 * Example queries & mutations to use this API server
 * Created using the examples here:
 * https://gist.github.com/deptno/e76d2550cfc0d374899c3e6efe5d7831
 */

import gql from 'graphql-tag';

/**
 * Get a resource with (up to) 6 levels of nested child concepts
 */
const CREATE_RESOURCE = gql`
  mutation {
    CreateResource(
      title: "Java"
      institution: "St Andrews"
      description: "Java is an object-oriented language"
    ) {
      id
      title
      institution
    }
  }
`;
