import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/AppButton";
import { useT } from "@/lib/i18n";

export function CommunityCta() {
  const t = useT();
  return (
    <section className="container-page pb-4">
      <div className="rounded-[var(--radius-card)] bg-primary px-6 py-16 text-center md:px-16 md:py-20">
        <h2 className="mx-auto max-w-2xl text-3xl leading-tight text-primary-foreground sm:text-4xl md:text-[2.75rem]">
          {t("communityCta.title")}
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-primary-foreground/80">
          {t("communityCta.description")}
        </p>
        <ButtonLink to="/places/new" variant="accent" size="lg" className="mt-8">
          {t("communityCta.addPlace")}
          <ArrowRight className="size-4" aria-hidden="true" />
        </ButtonLink>
      </div>
    </section>
  );
}
