/**
 * Example queries & mutations to use this API server
 * Created using the examples here:
 * https://gist.github.com/deptno/e76d2550cfc0d374899c3e6efe5d7831
 */

import gql from 'graphql-tag';

const RESOURCE_FRAGMENT = gql`
    fragment resource on Resource {
        id
        title
        institution
        description
    }
`;

const CONCEPT_FRAGMENT = gql`
    fragment concept on Concept {
        id
        title
        description {
            id
            body
        }
    }
`;