interface WordPressImageProps {
  src: string;
  srcSet?: string | null;
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  width?: number | null;
  height?: number | null;
}

/**
 * Uses WordPress-generated image variants directly. This keeps responsive
 * image selection in the browser and avoids a Vercel Image Optimization
 * transformation for every size/format variant.
 */
export function WordPressImage({
  src,
  srcSet,
  alt,
  sizes,
  className,
  priority = false,
  fill = false,
  width,
  height,
}: WordPressImageProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- WordPress provides the responsive srcSet; using next/image would route every variant through Vercel's paid optimizer.
    <img
      src={src}
      srcSet={srcSet || undefined}
      sizes={srcSet ? sizes : undefined}
      alt={alt}
      width={width ?? undefined}
      height={height ?? undefined}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      decoding="async"
      className={
        fill
          ? `absolute inset-0 size-full ${className ?? ""}`
          : className
      }
    />
  );
}
