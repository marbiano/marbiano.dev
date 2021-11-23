require("dotenv").config();

const path = require("path");
const fs = require("fs");
const fetch = require("node-fetch");
const {
  getIntrospectionQuery,
  printSchema,
  buildClientSchema,
} = require("graphql");

async function main() {
  const introspectionQuery = getIntrospectionQuery();
  const response = await fetch(process.env.DATOCMS_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${process.env.DATOCMS_API_TOKEN}`,
    },
    body: JSON.stringify({ query: introspectionQuery }),
  });

  const { data } = await response.json();

  const schema = buildClientSchema(data);

  const outputFile = path.join(__dirname, "./schema.gql");

  await fs.promises.writeFile(outputFile, printSchema(schema));
}

main();
