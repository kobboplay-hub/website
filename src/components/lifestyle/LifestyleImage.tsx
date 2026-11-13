"use client";

import { useEffect, useState } from "react";
import Image, { type ImageProps } from "next/image";

/** Flipped after the first hydration so only images mounted later fade in. */
let hydrated = false;

interface LifestyleImageProps extends ImageProps {
  /** Shimmer behind the image while it loads. Off for stacked images that would cover a visible one. */
  shimmer?: boolean;
}

/**
 * next/image with a shimmer placeholder. Images rendered on the server are never hidden (they may
 * finish loading before hydration, and hiding them would delay LCP); images that mount later, such
 * as gallery slides or the next page of products, fade in once decoded.
 */
export default function LifestyleImage({ shimmer = true, onLoad, style, alt, ...props }: LifestyleImageProps) {
  const [fadeIn] = useState(() => hydrated);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    hydrated = true;
  }, []);

  return (
    <>
      {shimmer && !loaded && <span aria-hidden className="ls-shimmer pointer-events-none absolute inset-0" />}
      <Image
        {...props}
        alt={alt}
        style={fadeIn && !loaded ? { ...style, opacity: 0 } : style}
        onLoad={(event) => {
          setLoaded(true);
          onLoad?.(event);
        }}
      />
    </>
  );
}
