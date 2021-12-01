import * as React from "react";
import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
  useLoaderData,
  useLocation,
} from "remix";
import type { LinksFunction } from "remix";
import * as Fathom from "fathom-client";

import globalStylesUrl from "~/styles/global.css";
import Logo from "~/components/Logo";

export function loader() {
  const fathomSiteId =
    typeof FATHOM_SITE_ID !== "undefined" ? FATHOM_SITE_ID : null;
  return {
    env: {
      FATHOM_SITE_ID: fathomSiteId,
    },
  };
}

export const links: LinksFunction = () => {
  return [
    {
      rel: "preload",
      href: "/fonts/marb-sans-regular.woff2",
      as: "font",
      crossOrigin: "anonymous",
    },
    {
      rel: "preload",
      href: "/fonts/marb-sans-bold.woff2",
      as: "font",
      crossOrigin: "anonymous",
    },
    {
      rel: "preload",
      href: "/fonts/marb-serif-regular.woff2",
      as: "font",
      crossOrigin: "anonymous",
    },
    {
      rel: "preload",
      href: "/fonts/marb-mono-regular.woff2",
      as: "font",
      crossOrigin: "anonymous",
    },
    { rel: "stylesheet", href: globalStylesUrl },
  ];
};

export default function App() {
  let { env } = useLoaderData();
  useFathom(env.FATHOM_SITE_ID);

  return (
    <Document>
      <Layout>
        <Outlet />
      </Layout>
    </Document>
  );
}

function Document({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        {title ? <title>{title}</title> : null}
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  );
}

function Layout({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="root">
      <Link to="/" className="logo">
        <Logo />
      </Link>
      {children}
    </div>
  );
}

function useFathom(siteId: string) {
  const isLoaded = React.useRef(false);
  const location = useLocation();

  React.useEffect(() => {
    if (siteId) {
      if (!isLoaded.current) {
        Fathom.load(siteId, {
          includedDomains: ["marbiano.dev"],
        });
        isLoaded.current = true;
      } else {
        Fathom.trackPageview();
      }
    }
  }, [location]);
}

export function CatchBoundary() {
  let caught = useCatch();

  let message;
  switch (caught.status) {
    case 401:
      message = (
        <p>
          Oops! Looks like you tried to visit a page that you do not have access
          to.
        </p>
      );
      break;
    case 404:
      message = (
        <p>Oops! Looks like you tried to visit a page that does not exist.</p>
      );
      break;

    default:
      throw new Error(caught.data || caught.statusText);
  }

  return (
    <Document title={`${caught.status} ${caught.statusText}`}>
      <Layout>
        <h1>
          {caught.status}: {caught.statusText}
        </h1>
        {message}
      </Layout>
    </Document>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);
  return (
    <Document title="Error!">
      <Layout>
        <div>
          <h1>There was an error</h1>
          <p>{error.message}</p>
          <hr />
          <p>
            Hey, developer, you should replace this with what you want your
            users to see.
          </p>
        </div>
      </Layout>
    </Document>
  );
}
