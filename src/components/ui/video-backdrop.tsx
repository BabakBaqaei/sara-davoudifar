"use client";

import { useRef } from "react";
import { useVideoInView } from "@/lib/use-video-in-view";

type Props = {
  mp4: string;
  webm?: string;
  poster?: string;
  /** شفافیت لایه — ۰.۵ یعنی نصف */
  opacity?: number;
  className?: string;
};

/**
 * ویدیوی پس‌زمینه‌ی نیم‌شفاف.
 *
 * توقف و پخش بر اساس دیده‌شدن، از هوک مشترک `useVideoInView` می‌آید — که
 * هم prefers-reduced-motion را احترام می‌گذارد و هم دلیلِ سه‌لایه‌بودنِ
 * تشخیصِ دیده‌شدن را توضیح می‌دهد.
 */
export default function VideoBackdrop({
  mp4,
  webm,
  poster,
  opacity = 0.5,
  className,
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  useVideoInView(wrapRef, videoRef);

  return (
    <div ref={wrapRef} aria-hidden="true" className={className} style={{ opacity }}>
      <video
        ref={videoRef}
        autoPlay
        className="h-full w-full object-cover"
        loop
        muted
        playsInline
        poster={poster}
        preload="metadata"
        tabIndex={-1}
      >
        {webm && <source src={webm} type="video/webm" />}
        <source src={mp4} type="video/mp4" />
      </video>
    </div>
  );
}
