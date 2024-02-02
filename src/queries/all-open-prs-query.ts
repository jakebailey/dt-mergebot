import { client } from "../graphql-client";
import { noNullish } from "../util/util";
import { gql } from "./__generated__";

const getAllOpenPRsAndCardIDsQuery = gql(`
query GetAllOpenPRsAndCardIDs($endCursor: String) {
  repository(owner: "DefinitelyTyped", name: "DefinitelyTyped") {
    id
    pullRequests(states: OPEN, orderBy: { field: UPDATED_AT, direction: DESC }, first: 100, after: $endCursor) {
      nodes {
        number
        projectCards(first: 100) { nodes { id } }
      }
      pageInfo { hasNextPage endCursor }
    }
  }
}`);

export async function getAllOpenPRsAndCardIDs() {
    const prs: number[] = [];
    const cardIDs: string[] = [];
    let endCursor: string | undefined | null;
    while (true) {
        const result = await client.query({
            query: getAllOpenPRsAndCardIDsQuery,
            fetchPolicy: "no-cache",
            variables: { endCursor },
        });
        const pullRequests = result.data.repository?.pullRequests;
        const nodes = noNullish(pullRequests?.nodes);
        prs.push(...nodes.map(pr => pr.number));
        for (const pr of nodes) {
            cardIDs.push(...noNullish(pr.projectCards.nodes).map(card => card.id));
        }
        if (!pullRequests?.pageInfo.hasNextPage) return { prs, cardIDs };
        endCursor = pullRequests.pageInfo.endCursor;
    }
}
