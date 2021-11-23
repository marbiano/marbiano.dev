import { GraphQLClient } from "graphql-request";

type RequestFunction = {
  query: string;
  variables?: { [key: string]: any };
  preview?: boolean;
};

export function request({ query, variables, preview }: RequestFunction) {
  const endpoint = preview
    ? `https://graphql.datocms.com/preview`
    : `https://graphql.datocms.com/`;
  const client = new GraphQLClient(endpoint, {
    fetch,
    headers: {
      authorization: `Bearer ${DATOCMS_API_TOKEN}`,
    },
  });
  return client.request(query, variables);
}
