import { NavLink, Outlet, useLoaderData } from "remix";
import type { LoaderFunction, LinksFunction } from "remix";
import { request } from "~/lib/dato-client";
import postStylesUrl from "~/styles/post.css";

type SeriesData = {
  series: {
    title: string;
    posts: [
      {
        title: string;
        slug: string;
      }
    ];
    login: string;
  };
};

const SERIES_QUERY = `query Series($slug: String) {
  series(filter: { slug: { eq: $slug }}) {
    title
    posts {
      slug
      title
    }
  }
}`;

export const loader: LoaderFunction = ({ params }) => {
  return request({
    query: SERIES_QUERY,
    variables: { slug: params.series },
  });
};

export function meta({ data }: { data: SeriesData }) {
  const { series } = data;
  return {
    title: series.title,
    description: `Read ${series.posts.length} post of this series`,
  };
}

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: postStylesUrl }];
};

export default function Index() {
  let { series } = useLoaderData<SeriesData>();

  return (
    <main className="container">
      <Outlet />
      <section className="series">
        <div className="series-content">
          <h2 className="series-title">{series.title}</h2>
          <ul className="series-list">
            {series.posts.map(({ slug, title }) => (
              <li key={slug}>
                <NavLink
                  to={slug}
                  className={({ isActive }) => (isActive ? "is-active" : "")}
                >
                  {title}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
