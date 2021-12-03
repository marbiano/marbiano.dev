import type { MetaFunction, LoaderFunction, LinksFunction } from "remix";
import { useLoaderData, Link } from "remix";
import { request } from "~/lib/dato-client";
import type { SeriesRecord } from "~/lib/types.d";
import homeStylesUrl from "~/styles/home.css";

type LoaderData = {
  allSeries: SeriesRecord[];
};

const ALL_SERIES_QUERY = `query AllSeries($limit: IntType) {
  allSeries(first: $limit) {
    title
    slug
    posts {
      slug
      title
    }
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

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: homeStylesUrl }];
};

export default function Index() {
  let { allSeries } = useLoaderData<LoaderData>();

  return (
    <ul className="boxes">
      {allSeries.map(({ title, slug, posts }) => (
        <li key={slug}>
          <h2>Series</h2>
          <h3>
            <span>{title}</span>
          </h3>
          {posts.slice(0, 5).length > 0 && (
            <ul className="posts">
              {posts.map(({ slug: postSlug, title }) => (
                <li key={postSlug}>
                  <Link to={`/${slug}/${postSlug}`} prefetch="intent">
                    {title}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );
}
