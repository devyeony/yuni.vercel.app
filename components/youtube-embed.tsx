"use client";

import React from 'react'

export interface YoutubeEmbedProps {
  videoId: string
}

const YoutubeEmbed: React.FC<YoutubeEmbedProps> = ({ videoId }) => {
  return (
    <div className="relative w-full pb-[56.25%] h-0">
      <iframe
        className="absolute top-0 left-0 w-full h-full"
        src={`https://www.youtube.com/embed/${videoId}`}
        title="YouTube video"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  )
}

export default YoutubeEmbed
