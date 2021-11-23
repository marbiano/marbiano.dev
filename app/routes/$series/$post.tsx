import { useLoaderData } from "remix";
import type { LoaderFunction } from "remix";
import { StructuredText } from "react-datocms";
import type { StructuredText as StructuredTextType } from "datocms-structured-text-utils";
import { request } from "~/lib/dato-client";
import type { PostRecord } from "~/lib/types.d";

type LoaderData = {
  post: PostRecord;
};

const POST_QUERY = `query Post($slug: String) {
  post(filter: { slug: { eq: $slug }}) {
    title
    _publishedAt
    content {
      value
    }
  }
}`;

export const loader: LoaderFunction = ({ params }) => {
  console.log();
  return request({
    query: POST_QUERY,
    variables: { slug: params.post },
  });
};

export function meta({ data }: { data: LoaderData }) {
  const { post } = data;
  return {
    title: post.title,
  };
}

export default function Index() {
  let { post } = useLoaderData<LoaderData>();
  const { title, content, _publishedAt: published } = post;

  return (
    <article className="post">
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
