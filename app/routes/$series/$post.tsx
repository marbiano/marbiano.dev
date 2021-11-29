import { useLoaderData, json } from "remix";
import type { LoaderFunction, LinksFunction } from "remix";
import { StructuredText } from "react-datocms";
import type { StructuredText as StructuredTextType } from "datocms-structured-text-utils";
import { request } from "~/lib/dato-client";
import type { PostRecord } from "~/lib/types.d";
import postStylesUrl from "~/styles/post.css";

type LoaderData = {
  post: PostRecord;
  url: string;
};

const POST_QUERY = `query Post($slug: String) {
  post(filter: { slug: { eq: $slug }}) {
    title
    _publishedAt
    content {
      value
    }
    metadata {
      title
      description
      image {
        url
      }
      twitterCard
    }
    accentColor {
      red
      blue
      green
    }
  }
}`;

export const loader: LoaderFunction = async ({ request: req, params }) => {
  const data = await request({
    query: POST_QUERY,
    variables: { slug: params.post },
  });
  return json({ ...data, url: req.url });
};

export function meta({ data }: { data: LoaderData }) {
  const { post } = data;
  return {
    title: post.metadata?.title || post.title,
    description: post.metadata?.description,
    "og:title": post.metadata?.title || post.title,
    "og:description": post.metadata?.description,
    "og:image": post.metadata?.image?.url,
    "og:url": data.url,
    "twitter:card": post.metadata?.twitterCard,
  };
}

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: postStylesUrl }];
};

export default function Index() {
  let { post } = useLoaderData<LoaderData>();
  const { title, content, _publishedAt: published, accentColor } = post;
  const accentColorStyle = accentColor
    ? `${accentColor.red}, ${accentColor.blue}, ${accentColor.green}`
    : null;

  return (
    <article
      className="post"
      style={{
        "--accent-color": accentColorStyle,
      }}
    >
      <header className="header">
        <h1 className="title">
          <span>{title}</span>
        </h1>
        <div className="created">
          {new Date(published).toLocaleDateString()}
        </div>
      </header>
      <section className="content">
        <StructuredText data={content as StructuredTextType} />
      </section>
    </article>
  );
}
