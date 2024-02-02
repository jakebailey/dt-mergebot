import { gql } from "./__generated__";

export { GetFileContent };

const GetFileContent = gql(`
  query GetFileContent($owner: String!, $name: String!, $expr: String!) {
    repository(owner: $owner, name: $name) {
      id
      object(expression: $expr) {
        ... on Blob {
          text
          byteSize
        }
      }
    }
  }`);
