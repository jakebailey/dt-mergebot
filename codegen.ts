
import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
    overwrite: true,
    schema: {
        "https://api.github.com/graphql": {
            headers: {
                authorization: `Bearer ${
                    process.env["DT_BOT_AUTH_TOKEN"] ||
                    process.env["BOT_AUTH_TOKEN"] ||
                    process.env["AUTH_TOKEN"]
                }`,
                accept: "application/vnd.github.starfox-preview+json, application/vnd.github.bane-preview+json",
                "user-agent": "dt-mergebot",
            },
        }
    },
    documents: ["src/**/*.ts"],
    generates: {
        "src/queries/__generated__/": {
            preset: "client",
            presetConfig: {
                gqlTagName: "gql",
            },
        }
    }
};

export default config;
