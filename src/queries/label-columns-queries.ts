import { client } from "../graphql-client";
import { noNullish } from "../util/util";
import { gql } from "./__generated__";
import { GetLabelsQuery } from "./__generated__/graphql";

export { getLabels, GetProjectColumns };

const GetLabelsQuery = gql(`
query GetLabels($endCursor: String) {
  repository(name: "DefinitelyTyped", owner: "DefinitelyTyped") {
    id
    labels(first: 100, after: $endCursor) {
      nodes {
        id
        name
      }
      pageInfo { hasNextPage endCursor }
    }
  }
}`);

type Labels = NonNullable<NonNullable<NonNullable<GetLabelsQuery["repository"]>["labels"]>["nodes"]>;

async function getLabels() {
    const labels: Labels[] = [];
    let endCursor: string | undefined | null;
    while (true) {
        const result = await client.query({
            query: GetLabelsQuery,
            fetchPolicy: "no-cache",
            variables: { endCursor },
        });
        const someLabels = result.data.repository?.labels;
        labels.push(...noNullish(someLabels?.nodes));
        if (!someLabels?.pageInfo.hasNextPage) return labels;
        endCursor = someLabels.pageInfo.endCursor;
    }
}

const GetProjectColumns = gql(`
query GetProjectColumns {
  repository(name:"DefinitelyTyped", owner:"DefinitelyTyped") {
    id
    project(number: 5) {
      id
      columns(first: 30) {
        nodes {
          id
          name
        }
      }
    }
  }
}`);
