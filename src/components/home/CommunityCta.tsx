import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/AppButton";
import { useT } from "@/lib/i18n";

export function CommunityCta() {
  const t = useT();
  return (
    <section className="container-page pb-6">
      <div className="topo-lines relative overflow-hidden rounded-[var(--radius-panel)] bg-forest px-6 py-20 text-primary-foreground md:px-16 md:py-24">
        <div className="relative mx-auto max-w-3xl text-center">
          <p className="eyebrow text-primary-foreground/55">{t("communityCta.eyebrow")}</p>
          <h2 className="mx-auto mt-5 max-w-2xl text-[2rem] leading-[1.06] text-primary-foreground sm:text-4xl md:text-5xl">
            {t("communityCta.title")}
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-primary-foreground/75">
            {t("communityCta.description")}
          </p>
          <ButtonLink to="/places/new" variant="ivory" size="lg" className="mt-9">
            {t("communityCta.addPlace")}
            <ArrowRight className="size-4" aria-hidden="true" />
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
