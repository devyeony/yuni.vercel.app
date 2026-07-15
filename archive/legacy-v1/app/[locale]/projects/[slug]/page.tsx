import { notFound } from "next/navigation";
import { allProjects } from "contentlayer/generated";
import { Mdx } from "@/components/mdx";
import { Header } from "./header";
import "./mdx.css";

type Props = {
  params: {
    slug: string;
    locale: string;
  };
};

const SUPPORTED_LOCALES = ["en", "ko"];

export async function generateStaticParams(): Promise<Props["params"][]> {
  const params: Props["params"][] = [];

  for (const locale of SUPPORTED_LOCALES) {
    allProjects
      .filter((p) => p.published && p.locale === locale)
      .forEach((project) => {
        params.push({ slug: project.slug, locale });
      });
  }

  return params;
}

export default async function PostPage({ params }: Props) {
  const { slug, locale } = params;

  const project = allProjects.find(
    (project) => project.slug === slug && project.locale === locale
  );

  if (!project) {
    notFound();
  }

  const mdxCode = project.body?.code ?? "";

  return (
    <div className="bg-zinc-50 mx-auto w-full md:max-w-screen-md lg:max-w-screen-lg min-h-screen mt-12 mb-16">
      <Header project={project} />
      <article className="px-10 py-12 mx-auto prose prose-zinc prose-quoteless max-w-none">
        <Mdx code={mdxCode} />
      </article>
    </div>
  );
}
