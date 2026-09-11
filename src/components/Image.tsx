import React from "react";

export function Image(
  props: React.ImgHTMLAttributes<HTMLImageElement> & {
    fallbackSrc?: string;
  }
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function observe(elm: any) {
    if (elm && elm instanceof HTMLImageElement) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            img.src = img.dataset.src!;
            observer.unobserve(img);
          }
        });
      });

      observer.observe(elm);
    }
  }

  function handleError(event: React.SyntheticEvent<HTMLImageElement>) {
    const image = event.currentTarget;
    if (image.src.endsWith("/game-placeholder.svg")) return;

    if (image.dataset.fallbackSrc && image.dataset.fallbackUsed !== "true") {
      image.dataset.fallbackUsed = "true";
      image.src = image.dataset.fallbackSrc;
      return;
    }

    image.src = "/game-placeholder.svg";
  }

  return (
    <img
      data-src={props.src}
      data-fallback-src={props.fallbackSrc}
      className={props.className}
      alt={props.alt}
      onError={handleError}
      ref={observe}
    />
  );
}
