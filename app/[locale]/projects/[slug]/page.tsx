import { notFound } from "next/navigation";
import { getLocale } from "next-intl/server";
import { allProjects } from "contentlayer/generated";
import { Mdx } from "@/components/mdx";
import { Header } from "./header";
import "./mdx.css";

type Props = {
  params: {
    slug: string
  };
};

export async function generateStaticParams(): Promise<Props["params"][]> {
  return allProjects
    .filter((p) => p.published)
    .map((p) => ({
      slug: p.slug
    }));
}

export default async function PostPage({ params }: Props) {
  const { slug } = params;
  const locale = await getLocale();

  const project = allProjects.find((project) => project.slug === slug && project.locale === locale);
  if (!project) {
    notFound();
  }

  return (
    <div className="bg-zinc-50 mx-auto w-full md:max-w-screen-md lg:max-w-screen-lg  min-h-screen mt-6 mb-16">
      <Header project={project} />
      <article className="px-6 py-12 mx-auto prose prose-zinc prose-quoteless max-w-none">
        <Mdx code={project.body.code} />
      </article>
    </div>
  );
}