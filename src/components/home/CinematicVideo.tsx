import { useEffect, useRef, useState } from "react";
import posterImage from "@/assets/place-belogradchik.jpg";
import { useT } from "@/lib/i18n";

/**
 * Cinematic atmospheric video section.
 *
 * REAL FOOTAGE GOES HERE:
 *   public/videos/bulgaria-cinematic.webm  (preferred, VP9/AV1)
 *   public/videos/bulgaria-cinematic.mp4   (H.264 fallback)
 * Until a licensed Bulgaria video file is added at those paths, the section
 * gracefully renders the poster photograph only. No footage is invented.
 */
const SOURCES = [
  { src: "/videos/bulgaria-cinematic.webm", type: "video/webm" },
  { src: "/videos/bulgaria-cinematic.mp4", type: "video/mp4" },
];

export function CinematicVideo() {
  const t = useT();
  const sectionRef = useRef<HTMLElement | null>(null);
  const [playVideo, setPlayVideo] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const smallScreen = window.matchMedia("(max-width: 767px)").matches;
    const saveData =
      (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData ===
      true;
    if (reducedMotion || smallScreen || saveData) return;

    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setPlayVideo(true);
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
      <div className="relative h-[70vh] min-h-[420px] w-full md:h-auto md:aspect-[21/9]">
        <img
          src={posterImage}
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          className="absolute inset-0 size-full object-cover"
        />
        {playVideo && !failed ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={posterImage}
            aria-hidden="true"
            tabIndex={-1}
            onError={() => setFailed(true)}
            className="absolute inset-0 size-full object-cover"
          >
            {SOURCES.map((s) => (
              <source key={s.src} src={s.src} type={s.type} />
            ))}
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
