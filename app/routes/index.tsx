import type { MetaFunction, LoaderFunction } from "remix";
import { useLoaderData, Link } from "remix";
import { request } from "~/lib/dato-client";

type AllSeriesData = {
  allSeries: [
    {
      title: string;
      slug: string;
    }
  ];
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
  let { allSeries } = useLoaderData<AllSeriesData>();

  return (
    <ul>
      {allSeries.map(({ title, slug }) => (
        <li>
          <Link to={slug}>{title}</Link>
        </li>
      ))}
    </ul>
  );
}
