import Image from "next/image";
import { cn } from "@/lib/utils";

interface FigureProps {
  src: string;
  alt: string;
  /** Aspect ratio of the frame. Photography is cropped, never letterboxed. */
  ratio?: string;
  caption?: string;
  captionRef?: string;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  sizes?: string;
  tone?: "light" | "dark";
  /** Cutouts sit directly on the page ground with no crop. */
  contain?: boolean;
}

/**
 * A photograph with an optional editorial caption. Images fill their frame
 * and are cropped by the frame's aspect ratio, so composition is controlled
 * by the layout rather than by whatever ratio the source file happens to be.
 */
export function Figure({
  src,
  alt,
  ratio = "4/3",
  caption,
  captionRef,
  className,
  imageClassName,
  priority = false,
  sizes = "(min-width: 1024px) 50vw, 100vw",
  tone = "light",
  contain = false,
}: FigureProps) {
  return (
    <figure className={cn("group/fig", className)}>
      <div
        className={cn("relative w-full overflow-hidden", !contain && "bg-canvas-subtle")}
        style={{ aspectRatio: ratio }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className={cn(contain ? "object-contain" : "object-cover", imageClassName)}
        />
      </div>
      {caption && (
        <figcaption
          className={cn(
            "mt-4 flex gap-4 text-[0.8125rem] leading-relaxed",
            tone === "dark" ? "text-cream-soft" : "text-ink-faint"
          )}
        >
          {captionRef && (
            <span className="metadata shrink-0 pt-0.5">{captionRef}</span>
          )}
          <span className="max-w-md">{caption}</span>
        </figcaption>
      )}
    </figure>
  );
}
