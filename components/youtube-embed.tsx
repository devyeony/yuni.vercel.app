"use client";

import React from "react";

export interface YoutubeEmbedProps {
  videoId: string;
  title?: string;
}

const YoutubeEmbed: React.FC<YoutubeEmbedProps> = ({
  videoId,
  title = "YouTube video",
}) => {
  return (
    <div className="relative w-full pb-[56.25%] h-0">
      <iframe
        className="absolute top-0 left-0 w-full h-full border-0"
        src={`https://www.youtube.com/embed/${videoId}`}
        title={title}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
};

export default YoutubeEmbed;
