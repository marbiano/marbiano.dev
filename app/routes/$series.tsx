import { NavLink, Outlet, useLoaderData } from "remix";
import type { LoaderFunction, LinksFunction } from "remix";
import { request } from "~/lib/dato-client";
import type { SeriesRecord } from "~/lib/types.d";
import seriesStylesUrl from "~/styles/series.css";

type LoaderData = {
  series: SeriesRecord;
};

const SERIES_QUERY = `query Series($slug: String) {
  series(filter: { slug: { eq: $slug }}) {
    title
    posts {
      slug
      title
    }
    art {
      url
    }
  }
}`;

export const loader: LoaderFunction = ({ params }) => {
  return request({
    query: SERIES_QUERY,
    variables: { slug: params.series },
  });
};

export function meta({ data }: { data: LoaderData }) {
  const { series } = data;
  return {
    title: series.title,
    description: `Read ${series.posts.length} post of this series`,
  };
}

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: seriesStylesUrl }];
};

export default function Index() {
  let { series } = useLoaderData<LoaderData>();

  return (
    <main className="container">
      <Outlet />
      <section className="series">
        <div className="series-content">
          <h2 className="series-title">
            <span>Series</span> {series.title}
          </h2>
          <ul className="series-list">
            {series.posts.map(({ slug, title }) => (
              <li key={slug}>
                <NavLink
                  to={slug as string}
                  className={({ isActive }) => (isActive ? "is-active" : "")}
                  prefetch="intent"
                >
                  {title}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </section>
      {series.art && <img className="series-art" src={series.art.url} />}
    </main>
  );
}
