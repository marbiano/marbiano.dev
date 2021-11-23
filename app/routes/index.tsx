import type { MetaFunction, LoaderFunction, LinksFunction } from "remix";
import { useLoaderData, json, Link } from "remix";
import postStylesUrl from "~/styles/post.css";

type IndexData = {
  resources: Array<{ name: string; url: string }>;
  demos: Array<{ name: string; to: string }>;
};

// Loaders provide data to components and are only ever called on the server, so
// you can connect to a database or run any server side code you want right next
// to the component that renders it.
// https://remix.run/api/conventions#loader
export let loader: LoaderFunction = () => {
  let data: IndexData = {
    resources: [
      {
        name: "Remix Docs",
        url: "https://remix.run/docs",
      },
      {
        name: "React Router Docs",
        url: "https://reactrouter.com/docs",
      },
      {
        name: "Remix Discord",
        url: "https://discord.gg/VBePs6d",
      },
    ],
    demos: [
      {
        to: "demos/actions",
        name: "Actions",
      },
      {
        to: "demos/about",
        name: "Nested Routes, CSS loading/unloading",
      },
      {
        to: "demos/params",
        name: "URL Params and Error Boundaries",
      },
    ],
  };

  // https://remix.run/api/remix#json
  return json(data);
};

// https://remix.run/api/conventions#meta
export let meta: MetaFunction = () => {
  return {
    title: "Remix Starter",
    description: "Welcome to remix!",
  };
};

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: postStylesUrl }];
};

// https://remix.run/guides/routing#index-routes
export default function Index() {
  let data = useLoaderData<IndexData>();

  return (
    <main className="container">
      <article className="post">
        <header className="header">
          <h1 className="title">
            <span>Hybrid Meetups</span>
          </h1>
          <div className="created">Sep 22, 2021</div>
        </header>
        <section className="content">
          <p>
            The first step is to set a body text size. Responsive sites usually
            define multiple text sizes for body at different viewports. I do
            this, too, but my preference is to have as few sizes as I can. I
            want fewer things to manage, thank you.
          </p>

          <p>
            As I’ve previously written, once I have enough visual space in the
            browser window to accommodate my preferred body type size, I stay
            with it. My preference is to approach the extra space of larger
            viewports as a layout challenge, not as a process of continually
            increasing the body text size. I want to use the space, not just
            fill it.
          </p>
          <p>
            The first step is to set a body text size. Responsive sites usually
            define multiple text sizes for body at different viewports. I do
            this, too, but my preference is to have as few sizes as I can. I
            want fewer things to manage, thank you.
          </p>

          <p>
            As I’ve previously written, once I have enough visual space in the
            browser window to accommodate my preferred body type size, I stay
            with it. My preference is to approach the extra space of larger
            viewports as a layout challenge, not as a process of continually
            increasing the body text size. I want to use the space, not just
            fill it.
          </p>

          <hr className="separator" />

          <p>
            The first step is to set a body text size. Responsive sites usually
            define multiple text sizes for body at different viewports. I do
            this, too, but my preference is to have as few sizes as I can. I
            want fewer things to manage, thank you.
          </p>

          <p>
            As I’ve previously written, once I have enough visual space in the
            browser window to accommodate my preferred body type size, I stay
            with it. My preference is to approach the extra space of larger
            viewports as a layout challenge, not as a process of continually
            increasing the body text size. I want to use the space, not just
            fill it.
          </p>
          <h2>We are coming</h2>
          <p>
            The first step is to set a body text size. Responsive sites usually
            define multiple text sizes for body at different viewports. I do
            this, too, but my preference is to have as few sizes as I can. I
            want fewer things to manage, thank you.
          </p>
          <ul>
            <li>First item of the list.</li>
            <li>Second item of the list.</li>
            <li>Third item of the list.</li>
            <li>Fourth item of the list.</li>
          </ul>
          <p>
            As I’ve previously written, once I have enough visual space in the
            browser window to accommodate my preferred body type size, I stay
            with it. My preference is to approach the extra space of larger
            viewports as a layout challenge, not as a process of continually
            increasing the body text size. I want to use the space, not just
            fill it.
          </p>
        </section>
      </article>
      <section className="series">
        <div className="series-content">
          <h2 className="series-title">Learning Remix</h2>
          <ul className="series-list">
            <li>
              <Link to="/test">Let’s build a rocketship</Link>
            </li>
            <li>
              <Link to="/test">Complex front-end problems</Link>
            </li>
            <li>
              <Link to="/test">SSR is cool again</Link>
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
}
