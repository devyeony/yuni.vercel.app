"use client";

import YoutubeEmbed from "@/components/youtube-embed";
import type { YoutubeEmbedProps } from "@/components/youtube-embed";

export default function YoutubeEmbedWrapper(props: YoutubeEmbedProps) {
  return <YoutubeEmbed {...props} />;
}