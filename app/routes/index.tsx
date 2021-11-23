import type { MetaFunction, LoaderFunction } from "remix";
import { useLoaderData, Link } from "remix";
import { request } from "~/lib/dato-client";
import type { SeriesRecord } from "~/lib/types.d";

type LoaderData = {
  allSeries: SeriesRecord[];
};

const ALL_SERIES_QUERY = `query AllSeries($limit: IntType) {
  allSeries(first: $limit) {
    title
    slug
  }
}`;

export const loader: LoaderFunction = () => {
  return request({
    query: ALL_SERIES_QUERY,
    variables: { limit: 10 },
  });
};

export let meta: MetaFunction = () => {
  return {
    title: "Marbiano",
    description: "Welcome to my site!",
  };
};

export default function Index() {
  let { allSeries } = useLoaderData<LoaderData>();

  return (
    <ul>
      {allSeries.map(({ title, slug }) => (
        <li>
          <Link to={slug as string}>{title}</Link>
        </li>
      ))}
    </ul>
  );
}
