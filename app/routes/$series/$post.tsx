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
  pageCount: string;
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
  if (params.post) {
    const [data, count] = await Promise.all([
      request({
        query: POST_QUERY,
        variables: { slug: params.post },
      }),
      PAGEVIEWS.get(params.post),
    ]);

    const newCount = count ? Number(count) + 1 : 1;
    await PAGEVIEWS.put(params.post, newCount.toString());

    return json({ ...data, url: req.url, pageCount: newCount });
  } else {
    return json({ url: req.url });
  }
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
  let { post, pageCount } = useLoaderData<LoaderData>();
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
          Posted on {new Date(published).toLocaleDateString("en-US")}, viewed{" "}
          {Number(pageCount).toLocaleString()} times.
        </div>
      </header>
      <section className="content">
        <StructuredText data={content as StructuredTextType} />
      </section>
    </article>
  );
}
