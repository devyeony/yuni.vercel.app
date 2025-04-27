import { notFound } from "next/navigation";
import { allProjects } from "contentlayer/generated";
import { Mdx } from "@/components/mdx";
import { Header } from "./header";
import "./mdx.css";

export const revalidate = 60;

type Props = {
  params: {
    slug: string;
  };
};

export async function generateStaticParams(): Promise<Props["params"][]> {
  return allProjects
    .filter((p) => p.published)
    .map((p) => ({
      slug: p.slug,
    }));
}

export default async function PostPage({ params }: Props) {
  const slug = params?.slug;
  const project = allProjects.find((project) => project.slug === slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="bg-zinc-50 min-h-screen mb-16">
      <Header project={project} />
      <article className="px-4 py-12 mx-auto prose prose-zinc prose-quoteless max-w-full sm:max-w-full md:max-w-screen-md lg:max-w-screen-lg">
  <Mdx code={project.body.code} />
</article>
    </div>
  );
}
