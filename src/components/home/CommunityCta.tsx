import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/AppButton";
import { useT } from "@/lib/i18n";
import { AtlasMap } from "@/components/home/AtlasMap";

export function CommunityCta() {
  const t = useT();
  return (
    <section className="bg-background">
      <div className="mx-auto w-full max-w-[1280px] px-5 lg:px-12">
        <div className="topo-rule text-stone" />
        <div className="grid grid-cols-1 items-center gap-14 py-20 md:py-28 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:gap-20 lg:py-36">
          <div className="max-w-xl">
            <p className="mb-5 flex items-center gap-3 text-accent">
              <span className="h-px w-8 bg-current" aria-hidden="true" />
              <span className="eyebrow">{t("communityCta.eyebrow")}</span>
            </p>
            <h2 className="text-[2.15rem] leading-[1.05] text-foreground sm:text-5xl lg:text-[3.75rem]">
              {t("communityCta.title")}
            </h2>
            <p className="mt-7 max-w-md text-base leading-relaxed text-muted-foreground">
              {t("communityCta.description")}
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-6">
              <ButtonLink to="/places/new" variant="primary" size="lg" className="group">
                {t("communityCta.addPlace")}
                <ArrowRight
                  className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </ButtonLink>
              <span className="eyebrow text-muted-foreground/80">{t("communityCta.note")}</span>
            </div>
          </div>
          <div className="flex flex-col items-center gap-6 lg:items-end">
            <AtlasMap />
            <p className="eyebrow max-w-[340px] text-center text-muted-foreground/80 lg:text-right">
              {t("communityCta.mapLabel")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
