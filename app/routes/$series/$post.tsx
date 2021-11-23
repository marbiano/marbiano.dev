import { useLoaderData } from "remix";
import type { LoaderFunction } from "remix";
import { StructuredText } from "react-datocms";
import type { StructuredText as StructuredTextType } from "datocms-structured-text-utils";
import { request } from "~/lib/dato-client";

type PostData = {
  post: {
    title: string;
    published: string;
    content: StructuredTextType;
  };
};

const POST_QUERY = `query POST($slug: String) {
  post(filter: { slug: { eq: $slug }}) {
    title
    published: _publishedAt
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

export function meta({ data }: { data: PostData }) {
  const { post } = data;
  return {
    title: post.title,
  };
}

export default function Index() {
  let { post } = useLoaderData<PostData>();
  const { title, published, content } = post;

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
        <StructuredText data={content} />
      </section>
    </article>
  );
}
