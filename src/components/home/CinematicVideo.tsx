import { useEffect, useRef, useState } from "react";
import posterImage from "@/assets/place-belogradchik.jpg";
import { useT } from "@/lib/i18n";

/** Served from the deployed site itself (public/media), so it works on any host. */
const VIDEO_MP4 = "/media/discover-bulgaria-journey.mp4";
const VIDEO_WEBM = "/media/discover-bulgaria-journey.webm";

/**
 * Cinematic atmospheric background video section.
 * Footage: drone flight over the Rhodope Mountains near Pamporovo, Bulgaria
 * (Pixabay, Content License — free for commercial use, no attribution required).
 * Optimized to 1920x1080 H.264, 14s, no audio track, served from CDN storage.
 */

export function CinematicVideo() {
  const t = useT();
  const sectionRef = useRef<HTMLElement | null>(null);
  const [mountVideo, setMountVideo] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData =
      (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData ===
      true;
    if (reducedMotion || saveData) return;

    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setMountVideo(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full overflow-hidden bg-forest-deep">
      <div className="relative h-[440px] w-full sm:h-[500px] md:h-[560px] lg:h-[62vh] lg:max-h-[700px]">
        <img
          src={posterImage}
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          className="absolute inset-0 size-full object-cover"
        />
        {mountVideo ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            controls={false}
            disablePictureInPicture
            disableRemotePlayback
            preload="metadata"
            poster={posterImage}
            aria-hidden="true"
            tabIndex={-1}
            ref={(node) => {
              if (node) node.muted = true;
            }}
            onCanPlay={(e) => {
              const v = e.currentTarget;
              v.muted = true;
              void v.play().then(
                () => setReady(true),
                (err: unknown) => {
                  if (import.meta.env.DEV) console.warn("[CinematicVideo] play() rejected", err);
                },
              );
            }}
            onError={() => {
              if (import.meta.env.DEV) console.warn("[CinematicVideo] source failed to load");
              setFailed(true);
              setReady(false);
            }}
            className={`absolute inset-0 size-full object-cover transition-opacity duration-700 ${
              ready && !failed ? "opacity-100" : "opacity-0"
            }`}
            style={{ pointerEvents: "none" }}
          >
            <source src={VIDEO_WEBM} type="video/webm" />
            <source src={VIDEO_MP4} type="video/mp4" />
          </video>
        ) : null}



        <div
          className="absolute inset-0 bg-overlay/65"
          aria-hidden="true"
          style={{
            backgroundImage:
              "linear-gradient(to top, var(--overlay) 0%, color-mix(in oklab, var(--overlay) 45%, transparent) 45%, color-mix(in oklab, var(--overlay) 60%, transparent) 100%)",
          }}
        />

        <div className="container-page relative flex h-full flex-col justify-end pb-14 md:pb-20">
          <div className="max-w-2xl">
            <p className="mb-5 flex items-center gap-3 text-primary-foreground/70">
              <span className="h-px w-8 bg-current" aria-hidden="true" />
              <span className="eyebrow">{t("cinematic.eyebrow")}</span>
            </p>
            <h2 className="text-[2.15rem] leading-[1.05] text-primary-foreground sm:text-5xl lg:text-[3.5rem]">
              {t("cinematic.title")}
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-primary-foreground/75">
              {t("cinematic.body")}
            </p>
          </div>
          <p className="eyebrow mt-10 flex items-center gap-4 text-primary-foreground/45">
            <span>{t("cinematic.place")}</span>
            <span className="h-px w-6 bg-current" aria-hidden="true" />
            <span>42.7° N</span>
          </p>
        </div>
      </div>
    </section>
  );
}
