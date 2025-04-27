import type { Project } from "@/.contentlayer/generated";
import { getProjectPeriod } from "@/utils/dateutils";
import Link from "next/link";
import Image from "next/image";

type Props = {
  project: Project;
};

export const ProjectArticle: React.FC<Props> = ({ project }) => {
  const tags = project.tags ?? [];

  return (
    <Link href={`/projects/${project.slug}`}>
      <div className="w-full sm:w-80 md:w-96 lg:w-108 border-2 border-zinc-300 bg-zinc-100 shadow-md rounded-lg duration-500 hover:scale-105 hover:shadow-xl hover:bg-cyan-100">
        <div className="mx-3 mb-3 border-b border-slate-300 pt-3 pb-2 px-1">
          <span className="px-2 py-1 text-sm font-medium bg-purple-200">
            {getProjectPeriod(project.startDate, project.endDate)}
          </span>
        </div>
        <div className="max-w-4xl mx-3">
          {project.thumbnail ? (
            <Image
              src={`/images/projects/thumbnail/${project.thumbnail}`}
              alt="Project Thumbnail Image"
              className="w-full h-72 object-cover"
              width={600}
              height={400}
            />
          ) : (
            <div className="w-full h-72 bg-black flex items-center justify-center">
              <span className="text-white text-3xl font-semibold">
                {project.title}
              </span>
            </div>
          )}
        </div>
        <div className="max-w-4xl px-4 pt-4 pb-7 w-full mx-1">
          <h3 className="text-2xl font-semibold text-gray-900">
            {project.title}
          </h3>
          <p className="mt-2 text-gray-600">{project.description}</p>
          <div className="flex items-center">
            <div className="mt-4 flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="rounded-full bg-green-200 px-3 py-1 text-xs font-medium text-green-800"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
