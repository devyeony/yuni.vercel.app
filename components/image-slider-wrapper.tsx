"use client";

import ImageSlider from "@/components/image-slider";
import type { ImageSliderProps } from "@/components/image-slider";

export default function ImageSliderWrapper(props: ImageSliderProps) {
  return <ImageSlider {...props} />;
}