type RequestFunction = {
  query: string;
  variables: { [key: string]: any };
  preview?: boolean;
};

export async function request({ query, variables, preview }: RequestFunction) {
  const endpoint = preview ? `${DATOCMS_API_URL}/preview` : DATOCMS_API_URL;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${DATOCMS_API_TOKEN}`,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  const { data } = await response.json();
  return data;
}
