import { useLoaderData, json } from "remix";
import type { LoaderFunction } from "remix";
import { StructuredText } from "react-datocms";
import type { StructuredText as StructuredTextType } from "datocms-structured-text-utils";
import { request } from "~/lib/dato-client";
import type { PostRecord } from "~/lib/types.d";

type LoaderData = {
  post: PostRecord;
  url: string;
};

const POST_QUERY = `query Post($slug: String) {
  post(filter: { slug: { eq: $slug }}) {
    title
    _publishedAt
    cover {
      url
      alt
    }
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
  const { metadata } = post;
  return {
    title: metadata?.title || post.title,
    description: metadata?.description,
    "og:title": metadata?.title || post.title,
    "og:description": metadata?.description,
    "og:image": metadata?.image?.url,
    "og:url": data.url,
    "twitter:card": metadata?.twitterCard,
  };
}

export default function Index() {
  let { post } = useLoaderData<LoaderData>();
  const { title, content, _publishedAt: published, cover } = post;

  return (
    <article className="post">
      {cover && (
        <div className="cover">
          <img src={cover.url} alt={cover.alt as string} />
        </div>
      )}
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
