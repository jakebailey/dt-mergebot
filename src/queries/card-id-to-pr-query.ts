import { client } from "../graphql-client";
import { gql } from "./__generated__";
import { PullRequestState } from "./__generated__/graphql";

interface CardPRInfo {
    number: number;
    state: PullRequestState;
}

export const runQueryToGetPRForCardId = async (id: string): Promise<CardPRInfo | undefined> => {
    const info = await client.query({
        query: gql(`
            query CardIdToPr($id: ID!) {
                node(id: $id) {
                    ... on ProjectCard { content { ... on PullRequest { state number } } }
                }
            }`),
        variables: { id },
        fetchPolicy: "no-cache",
    });
    const node = info.data.node;
    return (node?.__typename === "ProjectCard" && node.content?.__typename === "PullRequest")
        ? { number: node.content.number, state: node.content.state }
        : undefined;
};
